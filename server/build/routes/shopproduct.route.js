"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shopproduct_controller_1 = require("../controllers/shopproduct.controller");
const shopproductRouter = express_1.default.Router(); // маршрутизатор
const multer_1 = __importDefault(require("multer"));
//   import { //authorizeRoles, 
//     isAutheticatedseller } 
//  from "../middleware/authseller"
/////const multer = require('multer');
///////  const upload = multer();
/**
 На сервере вам нужно убедиться, что вы правильно обрабатываете FormData.
 Для обработки данных, отправленных в формате multipart/form-data, можно
 использовать такие middleware как multer.
 *
 */
// Конфигурация хранилища Multer
const storage = multer_1.default.memoryStorage(); // или использовать diskStorage для сохранения файлов на диск
const upload = (0, multer_1.default)({ storage: storage });
//Здесь memoryStorage хранит файлы в оперативной памяти. Если вы используете
// diskStorage, убедитесь, что путь и другие параметры настроены корректно.
shopproductRouter.post("/create-product", upload.array("images"), shopproduct_controller_1.createShopProduct);
/////shopRouter.post("/create-shop", upload.single('file'), registrationShop);
//   shopRouter.post("/create-shop",  registrationShop);
//    shopRouter.post("/activate-shop", activateShop);
//     shopRouter.post("/login-shop", loginShop);
//                                 //isAutheticated
//     shopRouter.post("/meseller", isAutheticatedseller, sellerInfo); //сам меняю
//         shopRouter.put("/update-shop-avatar",
//         updateAccessShopToken, //  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
//         isAutheticatedseller, //isAutheticated,
//      updateShopProfilePicture  );
//    shopRouter.put("/update-shop-info", 
//    updateAccessShopToken,  // updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
//    isAutheticatedseller, //isAutheticated, 
//     updateShopInfo);
exports.default = shopproductRouter;
