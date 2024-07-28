"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserShopService = exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = require("../utils/redis");
const user_model_1 = __importDefault(require("../models/user.model"));
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
//мы использем redis поэтому заменим на    
const getUserById = async (id, res) => {
    //console.log( "получим с кэша redis, и пользователь передается в формате Json")
    // соединение с бд
    await (0, db_1.default)();
    const userJson = await redis_1.redis.get(id);
    // получим с кэша redis, и пользователь передается в
    // формате Json
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({ success: true, user, });
    }
};
exports.getUserById = getUserById;
// get all users
const getAllUsersService = async (res) => {
    // соединение с бд
    await (0, db_1.default)();
    const users = await user_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, users, });
};
exports.getAllUsersService = getAllUsersService;
//update user role изменение роли пользователя
const updateUserRoleService = async (res, id, role) => {
    // соединение с бд
    await (0, db_1.default)();
    // находим пользователя по id  и по роли обновит правило
    const user = await user_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({ success: true, user, });
};
exports.updateUserRoleService = updateUserRoleService;
//добавим фиксацию магазина
//shopseller:{  //создан ли свой магазин
const updateUserShopService = async (res, id) => {
    const shopseller = true;
    // соединение с бд
    await (0, db_1.default)();
    //  console.log( " попытка обновить вызываем правило обновлений")
    // находим пользователя по id  и по роли обновит правило
    const user = await user_model_1.default.findByIdAndUpdate(id, { shopseller }, { new: true });
    // изменения юзера запишем
    await redis_1.redis.set(id, JSON.stringify(user)); // запишем в кэш
    // нет так как создается магазин res.status(201).json({ success: true,  user,  });
    res.status(201).json({ success: true });
};
exports.updateUserShopService = updateUserShopService;
