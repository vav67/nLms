import express from "express";
import {
    registrationShop,
    activateShop,
    loginShop,
    sellerInfo,
    updateAccessShopToken,
    updateShopProfilePicture,
    updateShopInfo
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
                                //isAutheticated
    shopRouter.post("/meseller", isAutheticatedseller, sellerInfo); //сам меняю

        shopRouter.put("/update-shop-avatar",
        updateAccessShopToken, //  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
        isAutheticatedseller, //isAutheticated,
     updateShopProfilePicture  );
  
   shopRouter.put("/update-shop-info", 
   updateAccessShopToken,  // updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
   isAutheticatedseller, //isAutheticated, 
    updateShopInfo);
   
  
    // userRouter.put("/update-user-password", 
    // updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
    // isAutheticated, updateUserPassword)
   
  

  



export default shopRouter;