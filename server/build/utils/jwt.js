"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
//options fo cookies
// токен доступа
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    // sameSite: "lax",
    sameSite: "none",
    secure: true,
};
// токен обновления
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    //sameSite: "lax",
    sameSite: "none",
    secure: true,
};
//------------------------
//ф-я отправки токена
const sendToken = (user, statusCode, res) => {
    //токен доступа
    const accessToken = user.SignAccessToken();
    //токен обновления
    const refreshToken = user.SignRefreshToken();
    // console.log( user, '<-user итак по идее sendToken accessToken=',accessToken, 
    //  '  refreshToken= ',refreshToken)
    // upload session to redis загрузить сеанс в Redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    // only set secure to true in production
    //установите для безопасности значение true только в производстве
    // if (process.env.NODE_ENV === "production") {
    //   accessTokenOptions.secure = true;
    // } 
    // 06-41-12 закоментировали тк производство не SEC 
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    // console.log( '---sendToken отправим-true  accessToken=',accessToken, 
    // '  user= ', user)
    res.status(statusCode).json({ success: true, user, accessToken, });
};
exports.sendToken = sendToken;
