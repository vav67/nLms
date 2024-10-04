"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAutheticated = exports.isttt = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = require("../utils/redis");
const user_controller_1 = require("../controllers/user.controller");
exports.isttt = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    // соединение с бд
    //  await connectDB();
    //console.log("------промежуточное isttt /////// ")
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("No access_token this resource", 400));
    }
    //console.log("------промежуточное isttt /////// access_token=", access_token)
    // Создание тестового токена
    //+      const testPayload = { test: "11" };  // Объект в качестве полезной нагрузки
    //+  const zz = jwt.sign(testPayload,  process.env.ACCESS_TOKEN || "", {
    //+   expiresIn: "5m" });
    //+  console.log("------промежуточное isttt == zz=", zz)
    //+  const decoded = jwt.verify(zz,  process.env.ACCESS_TOKEN as string) // as JwtPayload;
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        // console.log(decoded, "------промежуточное isttt /////// ПРОШОЛ")
        // Проверка, истек ли срок действия токена доступа
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            // console.log("------ промежуточное isAuthenticated ------ срок действия истек");
            await (0, user_controller_1.updateAccessToken)(req, res, next);
        }
        else {
            // Получаем пользователя из Redis по id из токена
            const user = await redis_1.redis.get(decoded.id);
            if (!user) {
                return next(new ErrorHandler_1.default("Please login to access this resource", 400));
            }
            req.user = JSON.parse(user);
            next();
        }
    }
    catch (error) {
        // console.error("------ промежуточное isAuthenticated ------ ошибка при проверке токена", error);
        // Обработка различных ошибок
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // console.log("------ промежуточное isAuthenticated ------ срок действия истек");
            // Обновляем токен, если он истек     
            // return next(new ErrorHandler("Access token expired", 401));
            // заменим на 
            await (0, user_controller_1.updateAccessToken)(req, res, next);
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new ErrorHandler_1.default("Access token is invalid", 401));
        }
        else {
            return next(new ErrorHandler_1.default("Failed to verify access token", 400));
        }
    }
});
// authenticated user
exports.isAutheticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    // соединение с бд
    //  await connectDB();
    //const access_token = req.cookies.access_token as string;
    const access_token = req.cookies.access_token;
    console.log("1------промежуточное isAutheticated /////// access_token=", access_token);
    if (!access_token) {
        return next(new ErrorHandler_1.default("No access_token this resource", 400));
    }
    //    const decoded = jwt.decode(access_token) as JwtPayload;
    // декодируем , учитывая соль
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    console.log("2------промежуточное isAutheticated /////// декодируем =", decoded);
    if (!decoded) {
        // console.log("2-2-----промежуточное isAutheticated access token is not valid" ) 
        return next(new ErrorHandler_1.default("access token is not valid", 400));
    }
    // проверьте, истек ли срок действия токена доступа
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
            console.log("3333------промежуточное isAutheticated  срок действия");
            await (0, user_controller_1.updateAccessToken)(req, res, next);
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        // соединение с бд
        await (0, db_1.default)();
        //берем из redis  
        const user = await redis_1.redis.get(decoded.id);
        console.log("4------промежуточное isAutheticated из редис", user);
        if (!user) { //в redis jncencndetn
            try {
                const uu = await user_model_1.default.findById(decoded.id);
                console.log("5------промежуточное isAutheticated  поиск", uu);
                req.user = uu; //  JSON.parse(uu);
                console.log("33------промежуточное isAutheticated /  =", req.user);
                next();
            }
            catch (error) {
                return next(new ErrorHandler_1.default("Please redis login to access this resource", 400));
            }
        }
        else {
            req.user = JSON.parse(user);
            next();
        }
    }
});
// validate user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler_1.default(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
