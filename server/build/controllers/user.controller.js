"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updateUserPassword = exports.updateUserInfo = exports.cookieAuth = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registrationUser = exports.tttUser = void 0;
require("dotenv").config(); //добавим  .env
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const path_1 = __importDefault(require("path"));
const jwt_1 = require("../utils/jwt");
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
const cloudinary_1 = __importDefault(require("cloudinary"));
//========tttUser=============================
exports.tttUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        console.log("---------контроллер- /////// ");
        const cook = req.cookies.access_token;
        //////////    const userId = req.user?._id;
        //         if (userId) {
        ///////////      getUserById(userId, res);
        // } else {
        //     return next(new ErrorHandler("User ID is not defined", 400));
        // }
        //console.log("@@@@@@@@@ tttUser=", req)
        res.status(200).json({
            success: true,
            message: "API  tttUser   is working  09июня  ===" + cook,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 411));
    }
});
//==========================================
//----------------- регистрация пользователя
exports.registrationUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    // console.log("req.body=", req.body)
    try {
        const { name, email, password } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("user Email already exit существует", 400));
        }
        const user = {
            name,
            email,
            password,
        };
        //???  const activationToken = (0, exports.createActivationToken)(user); на исходнике 06-41-55
        const activationToken = (0, exports.createActivationToken)(user);
        //  console.log("activationToken=", activationToken)
        //код активации
        const activationCode = activationToken.activationCode;
        //  console.log("activationCode=", activationCode)
        const data = { user: { name: user.name }, activationCode };
        //создаем письмо с активацией
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activation-mail.ejs"), data);
        try { //отправка почты
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Activated your account",
                template: "activation-mail.ejs",
                data,
            });
            //ответ - проверь свою электронную почту
            res.status(201).json({
                success: true,
                message: `Please check you email: ${user.email} to activated yout account!`,
                activationToken: activationToken.token,
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
//------- создание токена для активации - отправляют по почте
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode, }, process.env.ACTIVATION_SECRET, { expiresIn: "5m", } // срок действия
    );
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получаем переданные значения    токен и   код активации   
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        //  console.log("newUser=", newUser)
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default("Invalid activation code", 400));
        }
        //тогда новый пользователь
        const { name, email, password } = newUser.user;
        // соединение с бд
        await (0, db_1.default)();
        // проверка на существование   
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) { //такой уже есть
            return next(new ErrorHandler_1.default("Email already exitst", 400));
        }
        //    console.log("создаем name=", name, "email=", email, 
        //    "password=", password)   
        //создаем в бд
        const user = await user_model_1.default.create({
            name, email, password,
        });
        //    console.log(" СОЗДАНО")  
        res.status(201).json({ success: true, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter email and password", 400));
        }
        // соединение с бд
        await (0, db_1.default)();
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.log(" error=", error.message);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//logout -------------------выход из системы
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        // удалим кэш из redis   
        const userId = req.user?._id || "";
        console.log("*********** userId=", userId);
        redis_1.redis.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.log(" error=", error.message);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token - обновление токена доступа рефреш 
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //токен   
        // console.log("----updateAccessToken req.cookies = ", req.cookies)
        const refresh_token = req.cookies.refresh_token;
        //---добавлю предложение робота
        // Чтобы избежать этой ошибки, перед извлечением refresh token из куки, вы должны
        // сначала проверить его наличие. Если он отсутствует, вы можете просто перенаправить 
        //пользователя на страницу входа или вернуть сообщение о необходимости войти 
        // для доступа к ресурсам.
        if (!refresh_token) {
            return next(new ErrorHandler_1.default("предложение робота Please login to access this resource", 401));
        }
        //---------------------------------------
        //  console.log("----------updateAccessToken refresh_token = ", refresh_token)   
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        //не удалось обновить токен
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.default(message, 400));
        }
        //берем с кэш redis
        const session = await redis_1.redis.get(decoded.id);
        // console.log("----------updateAccessToken session = ", session )  
        if (!session) {
            // return next(new ErrorHandler(message, 400))
            return next(new ErrorHandler_1.default("Please login for access this resources!", 400));
        }
        const user = JSON.parse(session);
        // console.log("----------updateAccessToken user = ", user )       
        //создадим токен доступа
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, 
        // {  expiresIn: "5m",  //через пять минут
        { expiresIn: "3d",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, 
        //  { expiresIn: "3d", //через три дня
        { expiresIn: "6d", //через три дня
        });
        req.user = user;
        //обноввим файл cookie
        //console.log("----------обноввим файл cookie "  ) 
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        // добавим в кэш и установим срок действия (и будет удалено)- 7 дней =604800  
        // 1день = 60*60*24=86400
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800);
        //временно было res.status(200).json({  status: "success",  accessToken, });
        //console.log("----------обноввим и продолжим"  )  
        next(); //продолжим
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//Загрузка юзера-Load user
//get user info  
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        console.log("---------контроллер-/me--getUserInfo ");
        const userId = req.user?._id;
        //         if (userId) {
        (0, user_service_1.getUserById)(userId, res);
        // } else {
        //     return next(new ErrorHandler("User ID is not defined", 400));
        // }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 411));
    }
});
//----социальная аутентификация - заходит простой регистрирован пользователь
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            console.log('социальная аутен-я socialAuth создаем социального юзера ');
            //тогда создаем социального юзера
            const newUser = await user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            console.log('социальная аутен-я socialAuth для  юзера sendToken ');
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//--------------------------------------
exports.cookieAuth = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const acctoken = "равен=" + req.cookies.access_token;
        res.status(200).json({ success: true, acctoken, }); //ответ
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 406));
    }
});
//обновляем информацию о пользователе
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;
        // соединение с бд
        await (0, db_1.default)();
        //находим пользователя
        const user = await user_model_1.default.findById(userId);
        //- это ненужно
        // if(email && user){
        // const isEmailExist = await userModel.findOne({email})
        // if (isEmailExist){
        //    return next(new ErrorHandler("Email already exist", 400))
        //   }
        //    user.email = email 
        // }
        if (name && user) {
            user.name = name;
        } //присваиваеи новое имя юзеру
        await user?.save(); //сохраним
        await redis_1.redis.set(userId, JSON.stringify(user)); // запишем в кэш
        res.status(200).json({ success: true, user, }); //ответ
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//-------обновление пароля пользователя
exports.updateUserPassword = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получим старый и новый пароли
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) { //если нет паролей
            return next(new ErrorHandler_1.default("Please enter old password and new password", 400));
        }
        // соединение с бд
        await (0, db_1.default)();
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        // проверка старого пароля
        const isPsswordMatch = await user?.comparePassword(oldPassword);
        if (!isPsswordMatch) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        //присваиваем
        user.password = newPassword;
        //обновляем пароль
        await user.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// обновление изображения профиля
exports.updateProfilePicture = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // console.log( '=========== updateProfilePicture  обновление изображения профиля req=', req )   
        const { avatar } = req.body;
        const userId = req.user?._id;
        // соединение с бд
        await (0, db_1.default)();
        // найдем юзера
        const user = await user_model_1.default.findById(userId).select("+password");
        if (avatar && user) {
            //если есть юзер и картинка, то картинку надо удалить     
            //if user have one avatar then call this if
            if (user?.avatar?.public_id) {
                //удаляем старое изображение    
                //console.log( 'updateProfilePictur удаляем=', user?.avatar?.public_id)      
                //first delete the old image
                await cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                //загружаем новое изображение 
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                    //добавил сам   
                    overwrite: true, // Перезаписываем существующее изображение       
                    // // Устанавливаем public_id равным userId          
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            else {
                console.log('updateProfilePictur загружаем новое');
                // или загружаем новое изображение    
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                //  console.log( '----------updateProfilePictur  bbb'  ) 
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }
        await user?.save();
        console.log('----------updateProfilePictur ЗАПИСАЛИ');
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//get all users --- only for admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, user_service_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//изменение роли пользователя
//update user role--- only for admin
exports.updateUserRole = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //   console.log( 'updateUserRole  req.body= ', req.body)
        const { email, role } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            const id = isUserExist._id;
            (0, user_service_1.updateUserRoleService)(res, id, role); //вызываем правило обновлений
        }
        else {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete user --- only for admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        // соединение с бд
        await (0, db_1.default)();
        //ищем пользователя
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        //удаляем
        await user.deleteOne({ id });
        //также удалим в кеше redis
        await redis_1.redis.del(id);
        res.status(200).json({ success: true, message: "User deleted successfully", });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
