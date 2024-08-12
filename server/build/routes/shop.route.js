"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shop_controller_1 = require("../controllers/shop.controller");
const shopRouter = express_1.default.Router(); // маршрутизатор
const authseller_1 = require("../middleware/authseller");
///// const multer = require('multer');
///// const upload = multer();
/**
 На сервере вам нужно убедиться, что вы правильно обрабатываете FormData.
 Для обработки данных, отправленных в формате multipart/form-data, можно
 использовать такие middleware как multer.
 *
 */
/////shopRouter.post("/create-shop", upload.single('file'), registrationShop);
shopRouter.post("/create-shop", shop_controller_1.registrationShop);
shopRouter.post("/activate-shop", shop_controller_1.activateShop);
shopRouter.post("/login-shop", shop_controller_1.loginShop);
//isAutheticated
shopRouter.post("/meseller", authseller_1.isAutheticatedseller, shop_controller_1.sellerInfo); //сам меняю
shopRouter.put("/update-shop-avatar", shop_controller_1.updateAccessShopToken, //  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
authseller_1.isAutheticatedseller, //isAutheticated,
shop_controller_1.updateShopProfilePicture);
shopRouter.put("/update-shop-info", shop_controller_1.updateAccessShopToken, // updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
authseller_1.isAutheticatedseller, //isAutheticated, 
shop_controller_1.updateShopInfo);
// userRouter.put("/update-user-password", 
// updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
// isAutheticated, updateUserPassword)
exports.default = shopRouter;
