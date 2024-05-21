require("dotenv").config(); //добавим  .env
import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/user.model";
 import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
 import ejs from "ejs";
 import sendEmail from "../utils/sendMail";
 import path from "path";
  import {
   accessTokenOptions,
   refreshTokenOptions,
    sendToken,
                  } from "../utils/jwt";
 
   import connectDB from "../utils/db"; 
  import { redis } from "../utils/redis";

  import {
    getAllUsersService,  getUserById,
    updateUserRoleService,
 } from "../services/user.service";
  import cloudinary from "cloudinary";


// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
//----------------- регистрация пользователя
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
     
   // console.log("req.body=", req.body)

    try {
      const { name, email, password } = req.body;

      // соединение с бд
 await connectDB();
      const isEmailExist = await userModel.findOne({ email });
   
   
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exit", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };
      
      const activationToken = createActivationToken(user);
    //  console.log("activationToken=", activationToken)

      //код активации
      const activationCode = activationToken.activationCode;

    //  console.log("activationCode=", activationCode)

      const data = { user: { name: user.name }, activationCode };

      //создаем письмо с активацией
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

 try {  //отправка почты
          await sendEmail({
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
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
//------- создание токена для активации - отправляют по почте
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
     { user, activationCode, },
        process.env.ACTIVATION_SECRET as Secret,
     { expiresIn: "5m",    }  // срок действия
  );
  return { token, activationCode };
};

//----------------Активация юзера после нажатия ссылки в письме
//activate user
interface IActivationRequsest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
  //получаем переданные значения    токен и   код активации   
      const { activation_token, activation_code } =
        req.body as IActivationRequsest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as {
              user: IUser; activationCode: string 
            };

          //  console.log("newUser=", newUser)

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
  //тогда новый пользователь
      const { name, email, password } = newUser.user;

  // соединение с бд
  await connectDB();

   // проверка на существование   
      const existUser = await userModel.findOne({ email });

      if (existUser) { //такой уже есть
        return next(new ErrorHandler("Email already exitst", 400));
      }

  //    console.log("создаем name=", name, "email=", email, 
  //    "password=", password)   
//создаем в бд
      const user = await userModel.create({
        name,  email,   password,  });

    //    console.log(" СОЗДАНО")  
        res.status(201).json({ success: true, });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//----------------------Вход юзера
//login user
interface ILoginRequsest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequsest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

   // соединение с бд
   await connectDB();
   
   
      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);

    } catch (error: any) {
      console.log(" error=",error.message )  
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//logout -------------------выход из системы
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
     
    try {

      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
  // удалим кэш из redis   
      const userId = req.user?._id || "";
      console.log("*********** userId=", userId )    
        redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(" error=",error.message )  
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

 // update access token - обновление токена доступа рефреш 
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
       
    try {
   //токен   
  // console.log("----updateAccessToken req.cookies = ", req.cookies)
      const refresh_token = req.cookies.refresh_token as string;
//---добавлю предложение робота
// Чтобы избежать этой ошибки, перед извлечением refresh token из куки, вы должны
// сначала проверить его наличие. Если он отсутствует, вы можете просто перенаправить 
//пользователя на страницу входа или вернуть сообщение о необходимости войти 
// для доступа к ресурсам.
if (!refresh_token) {
  return next(new ErrorHandler("предложение робота Please login to access this resource", 401));
}
 
//---------------------------------------
    //  console.log("----------updateAccessToken refresh_token = ", refresh_token)   
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      
//не удалось обновить токен
      const message = "Could not refresh token";

if (!decoded) { return next(new ErrorHandler(message, 400)) }
//берем с кэш redis
  const session = await redis.get(decoded.id as string);
  
 // console.log("----------updateAccessToken session = ", session )  

if (!session) { 
  // return next(new ErrorHandler(message, 400))
   return next(new ErrorHandler("Please login for access this resources!", 400))
 
  }

      const user = JSON.parse(session);

     // console.log("----------updateAccessToken user = ", user )       
//создадим токен доступа
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {  expiresIn: "5m",  //через пять минут
           }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "3d", //через три дня
           }
      );

      req.user = user;
//обноввим файл cookie
 console.log("----------обноввим файл cookie "  ) 
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

 // добавим в кэш и установим срок действия - 7 дней =604800   1день = 60*60*24=86400
     await redis.set(user._id, JSON.stringify(user), "EX", 604800);
 
 //временно было res.status(200).json({  status: "success",  accessToken, });
 console.log("----------обноввим и продолжим"  )  
 next();  //продолжим
 
  } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//Загрузка юзера-Load user
//get user info  
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
  //console.log("---------контроллер-/me--getUserInfo ")

      const userId = req.user?._id;
 //         if (userId) {
        getUserById(userId, res);
   // } else {
   //     return next(new ErrorHandler("User ID is not defined", 400));
   // }

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 411));
    }
  }
);

// social auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
//----социальная аутентификация - заходит простой регистрирован пользователь
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

        // соединение с бд
 await connectDB();

      const user = await userModel.findOne({ email });
      
      if (!user) {
        console.log( 'социальная аутен-я socialAuth создаем социального юзера ')
//тогда создаем социального юзера
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        console.log( 'социальная аутен-я socialAuth для  юзера sendToken ')
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//update user info
interface IUptadeUserInfo {
  name?: string;
  email?: string;
}
//обновляем информацию о пользователе
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name  } = req.body as IUptadeUserInfo;
      const userId = req.user?._id;
   
     // соединение с бд
 await connectDB();

      //находим пользователя
      const user = await userModel.findById(userId);

     //- это ненужно
      // if(email && user){
      // const isEmailExist = await userModel.findOne({email})
      // if (isEmailExist){
      //    return next(new ErrorHandler("Email already exist", 400))
      //   }
      //    user.email = email 
      // }

      if (name && user) { user.name = name }//присваиваеи новое имя юзеру
   
     
      await user?.save(); //сохраним

      await redis.set(userId, JSON.stringify(user));// запишем в кэш

      res.status(200).json({ success: true, user, }) //ответ

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUptadeUserPassword {
  oldPassword: string;
  newPassword: string;
}
//-------обновление пароля пользователя
export const updateUserPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //получим старый и новый пароли
      const { oldPassword, newPassword } = req.body as IUptadeUserPassword;

      if (!oldPassword || !newPassword) { //если нет паролей
        return next(
          new ErrorHandler("Please enter old password and new password", 400)
        );
      }

  // соединение с бд
  await connectDB();

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }
 
  // проверка старого пароля
      const isPsswordMatch = await user?.comparePassword(oldPassword);

      if (!isPsswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }
//присваиваем
      user.password = newPassword;
//обновляем пароль
      await user.save();

      await redis.set(req.user?._id, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IUpdateProfilePicture {
avatar: string
}

 // обновление изображения профиля
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
  // console.log( '=========== updateProfilePicture  обновление изображения профиля req=', req )   
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;
  
      // соединение с бд
  await connectDB();

      // найдем юзера
const user = await userModel.findById(userId).select("+password");

      if (avatar && user) {
   //если есть юзер и картинка, то картинку надо удалить     
        //if user have one avatar then call this if
        if (user?.avatar?.public_id) {
//удаляем старое изображение    
//console.log( 'updateProfilePictur удаляем=', user?.avatar?.public_id)      
          //first delete the old image
await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
//загружаем новое изображение 
const myCloud = await cloudinary.v2.uploader.upload(avatar, {
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
        } else {
          console.log( 'updateProfilePictur загружаем новое' )        
      // или загружаем новое изображение    
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
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
      console.log( '----------updateProfilePictur ЗАПИСАЛИ'  )  
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


//get all users --- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//изменение роли пользователя
//update user role--- only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
   //   console.log( 'updateUserRole  req.body= ', req.body)
      const {  email, role } = req.body;
        // соединение с бд
 await connectDB();

    const isUserExist = await userModel.findOne({ email });

   if (isUserExist) {
    const id = isUserExist._id;
    updateUserRoleService(res,id, role); //вызываем правило обновлений
  } else {
    res.status(400).json({
      success: false,
      message: "User not found",
    });
  }


    } catch (error: any) {
           return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user --- only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
  // соединение с бд
  await connectDB();

//ищем пользователя
      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
//удаляем
    await user.deleteOne({ id });
//также удалим в кеше redis
      await redis.del(id);

   res.status(200).json({ success: true,  message: "User deleted successfully", });
 
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
