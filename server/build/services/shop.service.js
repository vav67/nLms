"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopById = void 0;
const redis_1 = require("../utils/redis");
const db_1 = __importDefault(require("../utils/db"));
// получение пользователя по идентификатору
// из бд
//зам-м  export const getUserById = async (id: string, res: Response ) => {
//зам-м    const user = await User.findById(id)
//зам-м       res.status(201).json({
//зам-м         success: true,
//зам-м         user,
//зам-м       });
//зам-м      }
//мы использем red
//мы использем redis поэтому заменим на    
const getShopById = async (id, res) => {
    //console.log( "получим с кэша redis, и пользователь передается в формате Json")
    // соединение с бд
    await (0, db_1.default)();
    //  const userJson = await redis.get(id);
    const shopJson = await redis_1.redis.get(`shop:${id}`);
    // получим с кэша redis, и пользователь передается в
    // формате Json
    if (shopJson) {
        const seller = JSON.parse(shopJson);
        res.status(201).json({ success: true, seller, });
    }
};
exports.getShopById = getShopById;
