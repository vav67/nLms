require("dotenv").config(); //добавим  .env
import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";

import shopModel, { IShop } from "../models/shop.model";
 import ErrorHandler from "../utils/ErrorHandler";
 import { CatchAsyncError } from "./../middleware/catchAsyncErrors";

 import connectDB from "../utils/db"; 
 import { redis } from "../utils/redis";

 import jwt, { JwtPayload, Secret } from "jsonwebtoken";
 import ejs from "ejs";
 import sendEmail from "../utils/sendMail";
 import path from "path";
import { updateUserShopService } from "../services/user.service";
 
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendShopToken,
                 } from "../utils/jwt";
import { getShopById } from "../services/shop.service";


 // update access token - обновление токена доступа рефреш 
 export const updateAccessShopToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
       
    try {
   //токен   
  console.log("--- updateAccessShopToken = ", req )
      const refresh_shoptoken = req.cookies.refresh_shoptoken as string;
//---добавлю предложение робота
// Чтобы избежать этой ошибки, перед извлечением refresh token из куки, вы должны
// сначала проверить его наличие. Если он отсутствует, вы можете просто перенаправить 
//пользователя на страницу входа или вернуть сообщение о необходимости войти 
// для доступа к ресурсам.
if (!refresh_shoptoken) {
  return next(new ErrorHandler("SHOP предложение робота Please login to access this resource", 401));
}
 
//---------------------------------------
   
  const decoded = jwt.verify( refresh_shoptoken, process.env.REFRESH_TOKEN as string  ) as JwtPayload;
   
  console.log("------- decoded= ", decoded)    

//не удалось обновить токен
      const message = "Could not refresh token";

if (!decoded) { return next(new ErrorHandler(message, 400)) }
//берем с кэш redis
  //const sessionshopredis = await redis.get(decoded.id as string);
  const sessionshopredis = await redis.get( `shop:${decoded.id}`);
    
  console.log("----SHOP-----sessionshopredis = ", sessionshopredis)  

if (!sessionshopredis) { 
  // return next(new ErrorHandler(message, 400))
   return next(new ErrorHandler("Please login for access this resources!", 400))
 
  }

      const seller  = JSON.parse(sessionshopredis);

     // console.log("----------updateAccessToken user = ", user )       
//создадим токен доступа
      const accessTokenShop = jwt.sign(
        { id: seller._id },
        process.env.ACCESS_TOKEN as string,
       // {  expiresIn: "5m",  //через пять минут
          { expiresIn: "3d", 
         }
      );

      const refreshTokenShop = jwt.sign(
        { id: seller._id },
        process.env.REFRESH_TOKEN as string,
      //  { expiresIn: "3d", //через три дня
        { expiresIn: "6d", //через три дня
          }
      );

      req.seller  = seller;
//обноввим файл cookie
 //console.log("----------обноввим файл cookie "  ) 
      res.cookie("access_shoptoken", accessTokenShop, accessTokenOptions);
      res.cookie("refresh_shoptoken", refreshTokenShop, refreshTokenOptions);

 // добавим в кэш и установим срок действия (и будет удалено)- 7 дней =604800  
 // 1день = 60*60*24=86400
     await redis.set(`shop:${seller._id}`, JSON.stringify(seller), "EX", 604800);
 
 //временно было res.status(200).json({  status: "success",  accessToken, });
 //console.log("----------обноввим и продолжим"  )  
 next();  //продолжим
 
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
 
/**
 На сервере вам нужно убедиться, что вы правильно обрабатываете FormData. 
 Для обработки данных, отправленных в формате multipart/form-data, можно 
 использовать такие middleware как multer.
 * 
 */

// register shop
interface IRegistrationBodyShop {
    name: string;
    email: string;
    password: string;
     address: string;
     phoneNumber: string;
     zipCode: string;  
  //  avatar?: string;
  }

//---регистрация продавца=-----------------------

 // create shop
//    router.post("/create-shop",   upload.single("file"),
//                 catchAsyncErrors(async (req, res, next) => {
//пока файл upload.single("file") не добавляю 

export const registrationShop = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
       
      console.log("req.body=", req.body)
  
      try {
    
        const { name, email, password, address, phoneNumber, zipCode } = req.body;
       // const avatar = req.file;
    
        
      


      // соединение с бд
      await connectDB();
      const sellerEmail = await shopModel.findOne({ email });
 
        //с такой почтой уже есть магазин
        if (sellerEmail) {
    // такая почта существует        
            return next(new ErrorHandler("Магазин  существует", 400));

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


    const shop:  IRegistrationBodyShop = {
        name,
        email,
        password,
         address, phoneNumber, zipCode    
    };
      // cоздаем временный токен tokenshop и код активации
      const activationTokenshop = createActivationTokenshop(shop);
    //код активации
    const activationCodeShop = activationTokenshop.activationCodeShop;


   console.log("activationTokenshop=", activationTokenshop, 
    '    activationCodeShop=', activationCodeShop)
    
    const data = { shop: { name: shop.name }, activationCodeShop };

    //создаем письмо с активацией
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail-shop.ejs"),
      data
    );

try {  //отправка почты
  console.log("отправим почту")
  
  await sendEmail({
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
} catch (error: any) {
  return next(new ErrorHandler(error.message, 400));
}



    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  interface IActivationToken {
    tokenshop: string;
    activationCodeShop: string;
  }

  //------- создание токена для активации SHOP - отправляют по почте
export const createActivationTokenshop = (shop: any): IActivationToken => {
    const activationCodeShop = Math.floor(1000 + Math.random() * 9000).toString();
    const tokenshop = jwt.sign(
       { shop, activationCodeShop, },
          process.env.ACTIVATION_SECRET as Secret,
       { expiresIn: "10m",    }  // срок действия
    );
    return { tokenshop, activationCodeShop };
  };

  
//----------------Активация юзера после нажатия ссылки в письме
//activate shop
interface IActivationRequsestshop {
    activation_token_shop: string;
    activation_code_shop: string;
    activation_user_email:string;
  }
  
  export const activateShop = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
    //получаем переданные значения    токен и   код активации   
        const { activation_token_shop, activation_code_shop,
          activation_user_email,
         } =
          req.body as IActivationRequsestshop;
  
// соединение с бд
await connectDB();

      //    console.log("это почта создающего юзера =", activation_user_email)
      
 const isUserAct = await User.findOne({ email:activation_user_email });
      
  
   if (isUserAct) {
           const id = isUserAct._id;
        //   console.log("вызываем правило обновлений", activation_token_shop)
//----       
    
  //console.log("активация магазина=", req.body)   

  const newSeller: { shop: IShop; activationCodeShop: string } = jwt.verify(
    activation_token_shop,
    process.env.ACTIVATION_SECRET as string
  ) as {
          shop: IShop; activationCodeShop: string 
        };

  //  console.log("newSeller=", newSeller)

  if (newSeller.activationCodeShop !== activation_code_shop) {
    return next(new ErrorHandler("Invalid activation code", 400));
  }
//тогда новый Магазин для пользователя
  const { name, email, password, 
       avatar, address, phoneNumber, zipCode    
  } = newSeller.shop;

// соединение с бд
await connectDB();

// проверка на существование   
  const existUser = await shopModel.findOne({ email });

  if (existUser) { //такой уже есть
    return next(new ErrorHandler("маг существует такая Email already exitst", 400));
  }

 //console.log("создаем name=", name, "email=", email,   "password=", password)   
//создаем в бд
  const seller = await shopModel.create({
      name, email, password, 
      avatar, address, phoneNumber, zipCode  });
//после создания магазина, надо добавить юзеру поле true
       
//console.log("-- вызываем  updateUserShopService")
   //----    
     

   updateUserShopService(res, id  ); //вызываем правило обновлений
         
  }
   else {
   //такого юзера не сущесствует
  return next(new ErrorHandler("Not User not shopseller - не магазин ", 400));
 }
     } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );


  interface ILoginRequsestShop {
    email: string;
    password: string;
  }
// -------------- Вход в магазин

  export const loginShop = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body as ILoginRequsestShop;

        if (!email || !password) {
          return next(new ErrorHandler("Please enter email and password", 400));
        }
  
     // соединение с бд
     await connectDB();
     
     //здесь мы получаем user — это экземпляр документа shopModel,
     const seller = await shopModel.findOne({ email }).select("+password");

     if (!seller) {
       return next(new ErrorHandler("Invalid email or password", 400));
     }
// чтобі візвать метод в модели shopModel.comparePassword надо єтот
// метод візвать на этом экземпляре документа shopModel , поэтому
     const isPasswordMatch = await seller.comparePassword(password);

     if (!isPasswordMatch) {
       return next(new ErrorHandler("Invalid email or password", 400));
     }

   // тогда создадим токены
 
    /////    sendToken(user, 200, res);
    sendShopToken(seller, 201, res);
 
      } catch (error: any) {
        console.log(" error=",error.message )  
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

//----------------------------------------

  //Загрузка юзера-Load user
//get user info  
export const sellerInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
   console.log("---------контроллер-/meseller--sellerInfo ")

    const shopId = req.seller?._id;
 
        getShopById(shopId, res);

 
 
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 411));
    }
  }
);
