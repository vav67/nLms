require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

import jwt, { JwtPayload } from "jsonwebtoken"; //проверка


interface ITokenOptions {
  expires: Date;
  maxAge: number;   //макс время жизни
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300",  10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

//options fo cookies
// токен доступа
export const accessTokenOptions: ITokenOptions = {
  //expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  expires: new Date(Date.now() + accessTokenExpire * 24 * 60 * 60 * 1000),
//  maxAge: accessTokenExpire * 60 * 60 * 1000,
maxAge: accessTokenExpire * 24 * 60 * 60 * 1000,
httpOnly: true,
 // sameSite: "lax",
 sameSite: "none",
 secure:true,
};

// токен обновления
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  //sameSite: "lax",
  sameSite: "none",
  secure:true,
};



//------------------------

//ф-я отправки токена
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
 
 // console.log( '--выполнение  sendToken=',  statusCode )
  //токен доступа
  const accessToken = user.SignAccessToken();
//токен обновления
  const refreshToken = user.SignRefreshToken();
  
    // console.log( user, '<-user итак по идее sendToken accessToken=',accessToken, 
    // '  refreshToken= ',refreshToken)
 
    // const decoded = jwt.verify( accessToken ,  process.env.ACCESS_TOKEN as string)  as JwtPayload;
    
    // console.log('=== sendToken декодируем =', decoded) 

  // upload session to redis загрузить сеанс в Redis
  redis.set(user._id, JSON.stringify(user) as any);

 
// only set secure to true in production
//установите для безопасности значение true только в производстве
  // if (process.env.NODE_ENV === "production") {
  //   accessTokenOptions.secure = true;
  // } 
  // 06-41-12 закоментировали тк производство не SEC 

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // console.log( '---sendToken отправим-true  accessToken=',accessToken, 
  // '  user= ', user)

  res.status(statusCode).json({ success: true,  user, accessToken,  });
};
