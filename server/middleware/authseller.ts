import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

import connectDB from "../utils/db"; 
import { redis } from "../utils/redis";
import mongoose from "mongoose";


import { updateAccessToken } from "../controllers/user.controller";
import { updateAccessShopToken } from "../controllers/shop.controller";



// аутентификация продавца
export const isAutheticatedseller = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
     
       // соединение с бд
  //  await connectDB();
  
 const access_shoptoken = req.cookies.access_shoptoken   as string;
  
    console.log("------промежуточное isAutheticatedseller" )    
    
   if (!access_shoptoken) {
        return next(
          new ErrorHandler("No access_shoptoken this resource seller", 400)
        );
      }
  
   //    const decoded = jwt.decode(access_token) as JwtPayload;
    // декодируем , учитывая соль
    const decoded = jwt.verify(access_shoptoken,  process.env.ACCESS_TOKEN as string) as JwtPayload;
  
   console.log("------промежуточное isAutheticatedseller/////// декодируем =", decoded)  
  
      if (!decoded) {
        return next(new ErrorHandler("access Shoptoken is not valid", 400));
      }
  
      console.log(decoded.exp,"=decoded.exp-срок действия и <= дата/1000=", Date.now() / 1000 ) 

      // проверьте, истек ли срок действия токена доступа
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
   // console.log("------промежуточное isAutheticated  срок действия")    
      
             await updateAccessShopToken(req, res, next);
  
        } catch (error) {
          return next(error);
        }
      }
     else {
            // const seller = await redis.get(decoded.id);
            const seller = await redis.get(`shop:${decoded.id}`);
  
         
        if (!seller) {
          return next(
            new ErrorHandler("Please login to access this resource", 400)
          );
        }
        console.log("----итак--промежуточное req.seller=", seller)   
        req.seller = JSON.parse(seller);
  
        next();
      }
    }
  );
  
  
  