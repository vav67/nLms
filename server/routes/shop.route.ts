import express from "express";
import {
    registrationShop,
    activateShop,
    loginShop,
    sellerInfo
} from "../controllers/shop.controller"; 

const shopRouter = express.Router(); // маршрутизатор

  import { //authorizeRoles, 
    isAutheticatedseller } 
 from "../middleware/authseller"
///// const multer = require('multer');
///// const upload = multer();
/**
 На сервере вам нужно убедиться, что вы правильно обрабатываете FormData. 
 Для обработки данных, отправленных в формате multipart/form-data, можно 
 использовать такие middleware как multer.
 * 
 */

  /////shopRouter.post("/create-shop", upload.single('file'), registrationShop);
  shopRouter.post("/create-shop",  registrationShop);

   shopRouter.post("/activate-shop", activateShop);
    shopRouter.post("/login-shop", loginShop);

    shopRouter.post("/meseller", isAutheticatedseller, sellerInfo); //сам меняю
  




export default shopRouter;