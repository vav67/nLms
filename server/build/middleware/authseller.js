"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutheticatedseller = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
const shop_controller_1 = require("../controllers/shop.controller");
// аутентификация продавца
exports.isAutheticatedseller = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    // соединение с бд
    //  await connectDB();
    const access_shoptoken = req.cookies.access_shoptoken;
    console.log("------промежуточное isAutheticatedseller");
    if (!access_shoptoken) {
        return next(new ErrorHandler_1.default("No access_shoptoken this resource seller", 400));
    }
    //    const decoded = jwt.decode(access_token) as JwtPayload;
    // декодируем , учитывая соль
    const decoded = jsonwebtoken_1.default.verify(access_shoptoken, process.env.ACCESS_TOKEN);
    console.log("------промежуточное isAutheticatedseller/////// декодируем =", decoded);
    if (!decoded) {
        return next(new ErrorHandler_1.default("access Shoptoken is not valid", 400));
    }
    console.log(decoded.exp, "=decoded.exp-срок действия и <= дата/1000=", Date.now() / 1000);
    // проверьте, истек ли срок действия токена доступа
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
            // console.log("------промежуточное isAutheticated  срок действия")    
            await (0, shop_controller_1.updateAccessShopToken)(req, res, next);
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        // const seller = await redis.get(decoded.id);
        const seller = await redis_1.redis.get(`shop:${decoded.id}`);
        if (!seller) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 400));
        }
        console.log("----итак--промежуточное req.seller=", seller);
        req.seller = JSON.parse(seller);
        next();
    }
});
