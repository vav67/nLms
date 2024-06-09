import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

import connectDB from "../utils/db"; 
import { redis } from "../utils/redis";
import mongoose from "mongoose";


import { updateAccessToken } from "../controllers/user.controller";


export const isttt = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
       // соединение с бд
//  await connectDB();
//console.log("------промежуточное isttt /////// ")
   const access_token = req.cookies.access_token   as string;
 
 if (!access_token) {
  return next(
    new ErrorHandler("No access_token this resource", 400)
  );
}
//console.log("------промежуточное isttt /////// access_token=", access_token)
//console.log("------промежуточное isttt /// соль=", process.env.ACCESS_TOKEN as string )
 try {
     // Создание тестового токена
//+      const testPayload = { test: "11" };  // Объект в качестве полезной нагрузки
//+  const zz = jwt.sign(testPayload,  process.env.ACCESS_TOKEN || "", {
//+   expiresIn: "5m" });
//+  console.log("------промежуточное isttt == zz=", zz)
//+  const decoded = jwt.verify(zz,  process.env.ACCESS_TOKEN as string) // as JwtPayload;


 const decoded = jwt.verify(access_token,  process.env.ACCESS_TOKEN as string)   as JwtPayload;


 //console.log(decoded, "------промежуточное isttt /////// ПРОШОЛ")


// if (!decoded) {
//   return next(new ErrorHandler("access token is not valid", 400));
// }




 next();
//  res.status(200).json({
//   success: true,
//   message: "API  tttUser   is working сегодня==="+ access_token,
// });

  
} catch (error) {
//  console.error("------ промежуточное isttt ------ error verifying token", error);
  return next(new ErrorHandler("Failed to verify access token", 400));
}

  }
);

// authenticated user
export const isAutheticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
   
     // соединение с бд
//  await connectDB();

    //const access_token = req.cookies.access_token as string;
    const access_token = req.cookies.access_token   as string;

    if (!access_token) {
      return next(
        new ErrorHandler("No access_token this resource", 400)
      );
    }

9//    const decoded = jwt.decode(access_token) as JwtPayload;
  // декодируем , учитывая соль
  const decoded = jwt.verify(access_token,  process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    // проверьте, истек ли срок действия токена доступа
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      req.user = JSON.parse(user);

      next();
    }
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
 
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};






