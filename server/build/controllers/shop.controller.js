"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShopInfo = exports.updateShopProfilePicture = exports.sellerInfo = exports.loginShop = exports.activateShop = exports.createActivationTokenshop = exports.registrationShop = exports.updateAccessShopToken = void 0;
require("dotenv").config(); //добавим  .env
const user_model_1 = __importDefault(require("../models/user.model"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = require("../utils/redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
const user_service_1 = require("../services/user.service");
const jwt_1 = require("../utils/jwt");
const shop_service_1 = require("../services/shop.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
// update access token - обновление токена доступа рефреш 
exports.updateAccessShopToken = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //токен   
        console.log("@@ --- updateAccessShopToken = ", req.cookies);
        const refresh_shoptoken = req.cookies.refresh_shoptoken;
        //---добавлю предложение робота
        // Чтобы избежать этой ошибки, перед извлечением refresh token из куки, вы должны
        // сначала проверить его наличие. Если он отсутствует, вы можете просто перенаправить 
        //пользователя на страницу входа или вернуть сообщение о необходимости войти 
        // для доступа к ресурсам.
        if (!refresh_shoptoken) {
            return next(new ErrorHandler_1.default("SHOP предложение робота Please login to access this resource", 401));
        }
        //---------------------------------------
        const decoded = jsonwebtoken_1.default.verify(refresh_shoptoken, process.env.REFRESH_TOKEN);
        console.log("------- decoded= ", decoded);
        //не удалось обновить токен
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        //берем с кэш redis
        //const sessionshopredis = await redis.get(decoded.id as string);
        const sessionshopredis = await redis_1.redis.get(`shop:${decoded.id}`);
        console.log("----SHOP-----sessionshopredis = ", sessionshopredis);
        if (!sessionshopredis) {
            // return next(new ErrorHandler(message, 400))
            return next(new ErrorHandler_1.default("Please login for access this resources!", 400));
        }
        const seller = JSON.parse(sessionshopredis);
        // console.log("----------updateAccessToken user = ", user )       
        //создадим токен доступа
        const accessTokenShop = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.ACCESS_TOKEN, 
        // {  expiresIn: "5m",  //через пять минут
        { expiresIn: "3d",
        });
        const refreshTokenShop = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.REFRESH_TOKEN, 
        //  { expiresIn: "3d", //через три дня
        { expiresIn: "6d", //через три дня
        });
        req.seller = seller;
        //обноввим файл cookie
        console.log("-@@---------обноввим файл cookie ");
        res.cookie("access_shoptoken", accessTokenShop, jwt_1.accessTokenOptions);
        res.cookie("refresh_shoptoken", refreshTokenShop, jwt_1.refreshTokenOptions);
        // добавим в кэш и установим срок действия (и будет удалено)- 7 дней =604800  
        // 1день = 60*60*24=86400
        await redis_1.redis.set(`shop:${seller._id}`, JSON.stringify(seller), "EX", 604800);
        //временно было res.status(200).json({  status: "success",  accessToken, });
        console.log("-@@   ---------обноввим и продолжим accessTokenShop=", accessTokenShop);
        next(); //продолжим
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//---регистрация продавца=-----------------------
// create shop
//    router.post("/create-shop",   upload.single("file"),
//                 catchAsyncErrors(async (req, res, next) => {
//пока файл upload.single("file") не добавляю 
exports.registrationShop = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    console.log("req.body=", req.body);
    try {
        const { name, email, password, address, phoneNumber, zipCode } = req.body;
        // const avatar = req.file;
        // соединение с бд
        await (0, db_1.default)();
        const sellerEmail = await shop_model_1.default.findOne({ email });
        //с такой почтой уже есть магазин
        if (sellerEmail) {
            // такая почта существует        
            return next(new ErrorHandler_1.default("Магазин  существует", 400));
            // ПОКА С ФАЙЛОМ НЕ РАБОТАЕМ
            //        const filename =req.file.filename
            //       const filePath = `uploads/${filename}`
            //       fs.unlink(filePath, (err) =>{
            //  if(err){  console.log(err)
            //     res.status(500).json({message: "Error deleting file"})
            //        } 
            //    }) 
            //     return next(new ErrorHandler("User already exists", 400));
        }
        // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //   folder: "avatars",
        // });
        // const filename =req.file.filename
        // const fileUrl = path.join(filename)
        // console.log("/create-shop=",fileUrl)
        // const seller = {
        //   name: req.body.name,
        //   email: email,
        //   password: req.body.password,
        // avatar: fileUrl,
        //   //  avatar: {
        // //    public_id: myCloud.public_id,
        // //    url: myCloud.secure_url,
        // //  },
        //   address: req.body.address,
        //   phoneNumber: req.body.phoneNumber,
        //   zipCode: req.body.zipCode,
        // };
        const shop = {
            name,
            email,
            password,
            address, phoneNumber, zipCode
        };
        // cоздаем временный токен tokenshop и код активации
        const activationTokenshop = (0, exports.createActivationTokenshop)(shop);
        //код активации
        const activationCodeShop = activationTokenshop.activationCodeShop;
        console.log("activationTokenshop=", activationTokenshop, '    activationCodeShop=', activationCodeShop);
        const data = { shop: { name: shop.name }, activationCodeShop };
        //создаем письмо с активацией
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail-shop.ejs"), data);
        try { //отправка почты
            console.log("отправим почту");
            await (0, sendMail_1.default)({
                email: shop.email,
                subject: "Activated your account Магазина",
                template: "activation-mail-shop.ejs",
                data,
            });
            //    console.log("итак равно")
            //ответ - проверь свою электронную почту
            res.status(201).json({
                success: true,
                message: `Please check you email: ${shop.email} to activated yout seller Магазин!`,
                activationTokenShop: activationTokenshop.tokenshop,
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//------- создание токена для активации SHOP - отправляют по почте
const createActivationTokenshop = (shop) => {
    const activationCodeShop = Math.floor(1000 + Math.random() * 9000).toString();
    const tokenshop = jsonwebtoken_1.default.sign({ shop, activationCodeShop, }, process.env.ACTIVATION_SECRET, { expiresIn: "10m", } // срок действия
    );
    return { tokenshop, activationCodeShop };
};
exports.createActivationTokenshop = createActivationTokenshop;
exports.activateShop = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получаем переданные значения    токен и   код активации   
        const { activation_token_shop, activation_code_shop, activation_user_email, } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        //    console.log("это почта создающего юзера =", activation_user_email)
        const isUserAct = await user_model_1.default.findOne({ email: activation_user_email });
        if (isUserAct) {
            const id = isUserAct._id;
            //   console.log("вызываем правило обновлений", activation_token_shop)
            //----       
            //console.log("активация магазина=", req.body)   
            const newSeller = jsonwebtoken_1.default.verify(activation_token_shop, process.env.ACTIVATION_SECRET);
            //  console.log("newSeller=", newSeller)
            if (newSeller.activationCodeShop !== activation_code_shop) {
                return next(new ErrorHandler_1.default("Invalid activation code", 400));
            }
            //тогда новый Магазин для пользователя
            const { name, email, password, avatar, address, phoneNumber, zipCode } = newSeller.shop;
            // соединение с бд
            await (0, db_1.default)();
            // проверка на существование   
            const existUser = await shop_model_1.default.findOne({ email });
            if (existUser) { //такой уже есть
                return next(new ErrorHandler_1.default("маг существует такая Email already exitst", 400));
            }
            //console.log("создаем name=", name, "email=", email,   "password=", password)   
            //создаем в бд
            const seller = await shop_model_1.default.create({
                name, email, password,
                avatar, address, phoneNumber, zipCode
            });
            //после создания магазина, надо добавить юзеру поле true
            //console.log("-- вызываем  updateUserShopService")
            //----    
            (0, user_service_1.updateUserShopService)(res, id); //вызываем правило обновлений
        }
        else {
            //такого юзера не сущесствует
            return next(new ErrorHandler_1.default("Not User not shopseller - не магазин ", 400));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// -------------- Вход в магазин
exports.loginShop = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        // соединение с бд
        await (0, db_1.default)();
        //здесь мы получаем user — это экземпляр документа shopModel,
        const seller = await shop_model_1.default.findOne({ email }).select("+password");
        if (!seller) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        // чтобі візвать метод в модели shopModel.comparePassword надо єтот
        // метод візвать на этом экземпляре документа shopModel , поэтому
        const isPasswordMatch = await seller.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        // тогда создадим токены
        /////    sendToken(user, 200, res);
        (0, jwt_1.sendShopToken)(seller, 201, res);
    }
    catch (error) {
        console.log(" error=", error.message);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//----------------------------------------
//Загрузка юзера-Load user
//get user info 
exports.sellerInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        console.log("---------контроллер-/meseller--sellerInfo ");
        const shopId = req.seller?._id;
        (0, shop_service_1.getShopById)(shopId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 411));
    }
});
// обновление изображения профиля
exports.updateShopProfilePicture = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // console.log( '=========== updateProfilePicture  обновление изображения профиля req=', req )   
        const { avatar } = req.body;
        const shopId = req.seller?._id;
        // соединение с бд
        await (0, db_1.default)();
        // найдем юзера
        const shop = await shop_model_1.default.findById(shopId).select("+password");
        if (avatar && shop) {
            //если есть юзер и картинка, то картинку надо удалить     
            //if user have one avatar then call this if
            if (shop?.avatar?.public_id) {
                //удаляем старое изображение    
                //console.log( 'updateProfilePictur удаляем=', user?.avatar?.public_id)      
                //first delete the old image
                await cloudinary_1.default.v2.uploader.destroy(shop?.avatar?.public_id);
                //загружаем новое изображение 
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                    //добавил сам   
                    overwrite: true, // Перезаписываем существующее изображение       
                    // // Устанавливаем public_id равным userId          
                });
                shop.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else { // тогда нет изображения, создаем новое
                console.log('updateProfilePictur загружаем новое');
                // или загружаем новое изображение    
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                //  console.log( '----------updateProfilePictur  bbb'  ) 
                shop.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        await shop?.save();
        //    console.log( '--АВАТАР--------updateProfilePictur ЗАПИСАЛИ shop=', shop  ) 
        await redis_1.redis.set(`shop:${shopId}`, JSON.stringify(shop));
        // наверное нужно с редиса удалить    
        // await redis.del(`shop:${shopId}`  )   //также удалим в кеше redi
        res.status(200).json({
            success: true,
            shop, ///  ?? только аватар здесь
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//обновляем информацию о пользователе
exports.updateShopInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //    console.log( '@@--------updateShopInfo req.body=', req  )      
        const { name, description, address, phoneNumber, zipCode } = req.body; // as IUptadeUserInfo;
        const shopId = req.seller?._id;
        console.log('@@--------updateShopInfo req.body= shopId=', req.seller?._id);
        // соединение с бд
        await (0, db_1.default)();
        //находим пользователя
        const shop = await shop_model_1.default.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler_1.default("Invalid shop", 400));
        }
        //- это ненужно
        // if(email && user){
        // const isEmailExist = await userModel.findOne({email})
        // if (isEmailExist){
        //    return next(new ErrorHandler("Email already exist", 400))
        //   }
        //    user.email = email 
        // }
        if (shop) {
            shop.name = name;
            shop.description = description;
            shop.address = address;
            shop.phoneNumber = phoneNumber;
            shop.zipCode = zipCode;
        } //присваиваеи новое  
        console.log('@@--------updateShopInfo записываем shop=', shop);
        await shop?.save(); //сохраним
        // наверное нужно с редиса удалить    
        //  await redis.del(`shop:${shopId}`  )   //также удалим в кеше redi
        //запишем обновленную в редис
        await redis_1.redis.set(`shop:${shop._id}`, JSON.stringify(shop)); // запишем в кэш
        console.log('@@--------updateShopInfo результ ок');
        res.status(200).json({ success: true, shop, }); //ответ shop - не полный
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// // update user password
// interface IUptadeUserPassword {
//   oldPassword: string;
//   newPassword: string;
// }
// //-------обновление пароля пользователя
// export const updateUserPassword = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       //получим старый и новый пароли
//       const { oldPassword, newPassword } = req.body as IUptadeUserPassword;
//       if (!oldPassword || !newPassword) { //если нет паролей
//         return next(
//           new ErrorHandler("Please enter old password and new password", 400)
//         );
//       }
//   // соединение с бд
//   await connectDB();
//       const user = await User.findById(req.user?._id).select("+password");
//       if (user?.password === undefined) {
//         return next(new ErrorHandler("Invalid user", 400));
//       }
//   // проверка старого пароля
//       const isPsswordMatch = await user?.comparePassword(oldPassword);
//       if (!isPsswordMatch) {
//         return next(new ErrorHandler("Invalid old password", 400));
//       }
// //присваиваем
//       user.password = newPassword;
// //обновляем пароль
//       await user.save();
//       await redis.set(req.user?._id, JSON.stringify(user));
//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );
// interface IUpdateProfilePicture {
// avatar: string
// }
