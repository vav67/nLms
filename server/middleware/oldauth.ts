require("dotenv").config(); //добавим  .env
 import { Request, Response, NextFunction } from "express";
  import { CatchAsyncError } from "./catchAsyncErrors";
   import ErrorHandler from "../utils/ErrorHandler";
 import jwt, { JwtPayload } from "jsonwebtoken";
  import { redis } from "../utils/redis";
  import { updateAccessToken } from "../controllers/user.controller";


  //authenticated user аутентифицирование
  export const isAutheticated = CatchAsyncError(
   async (req: Request, res: Response, next: NextFunction) => {
     
   //токен доступа берем из куки
     const access_token = req.cookies.access_token as string
 //console.log("######## аутентифицирование isAutheticate### - access_token= ", access_token )   
//access_token=  undefined
 
    if (!access_token) {
 //заменю сам на 
// if (!access_token ||  (access_token === undefined) ) {
    // console.log("------isAutheticated Пожалуйста, войдите, чтобы получить доступ " )  
    // значит не вошел в систему 
        return next(new ErrorHandler("Please login to access this resource Пожалуйста, войдите, чтобы получить доступ к этому ресурсу", 400) );
    }  
       // В этом месте вы можете установить req.user в null или undefined, если это 
       //необходимо для вашей логики приложения
                            
    //x   req.user = undefined; // или  req.user = null
    //x  return next(); // Продолжаем выполнение кода без вызова ошибки
     //x     }

  
     //x  return next(); // Продолжаем выполнение кода без вызова ошибки
      //x     }


  // в конце такой  
   const decoded = jwt.decode(access_token) as JwtPayload;
   // декодируем , учитывая соль
 //  const decoded = jwt.verify(access_token,  process.env.ACCESS_TOKEN as string) as JwtPayload;

    //console.log("------isAutheticated не вошел в систему decoded=", decoded )  
    if (!decoded) {
    //  console.log("------isAutheticated  access token is not valid " )   
         return next(new ErrorHandler("access token is not valid", 400));
    //x  req.user = undefined; // или  req.user = null
     //x return next(); // Продолжаем выполнение кода без вызова ошибки
    }
/////////////////////////////////////////
// проверьте, истек ли срок действия токена доступа
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
             await updateAccessToken(req, res, next);
      } catch (error) { 
            return next(error);
         }
     } else {

    // возьмем из кэша redis
              const user = await redis.get(decoded.id);
    if (!user) {
   //   console.log("------isAutheticated  пользователь не найден " )    
      // пользователь не найден
        return next(
          new ErrorHandler("Please login to access this resource", 400));
     //x req.user = undefined; // или  req.user = null
    //x return next(); // Продолжаем выполнение кода без вызова ошибки
    }
    //в папке @types -custom.d.ts - опишем interface  
    req.user = JSON.parse(user);
   // console.log("------isAutheticated  ПРОЙДЕНО " )   
      next(); //взяли пользователя и дальше к контроллеру
     }
  }
 );




// например (только для админа ) если  userRouter.get("/logout", 
//          isAutheticated,authorizeRoles("admin"), logoutUser);
// а роль пользователя в бд другая тогда ошибка 

//Правило - постоянные авторизованные роли
// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
  // Включают ли роли  
 // console.log("------authorizeRoles role=", req.user?.role )  
    if (!roles.includes(req.user?.role || "")) {
      return next(
    // пользователю не разрешено    
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
   // console.log("------authorizeRoles role РАЗРЕШЕНО"  )  
    next();
  };
};