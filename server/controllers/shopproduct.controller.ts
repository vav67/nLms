require("dotenv").config(); //добавим  .env
  import { NextFunction, Request, Response } from "express";
// import User, { IUser } from "../models/user.model";

  import shopModel, { IShop } from "../models/shop.model";
  import ErrorHandler from "../utils/ErrorHandler";
  import { CatchAsyncError } from "./../middleware/catchAsyncErrors";

   import connectDB from "../utils/db"; 
   import { redis } from "../utils/redis";
import ProductModel from "../models/product.model";
import cloudinary from "cloudinary";


//const { upload } = require("../multer")

//  import jwt, { JwtPayload, Secret } from "jsonwebtoken";
//  import ejs from "ejs";
//  import sendEmail from "../utils/sendMail";
  //import path from "path";
// import { updateUserShopService } from "../services/user.service";
 
// import {
//   accessTokenOptions,
//   refreshTokenOptions,
//   sendShopToken,
//                  } from "../utils/jwt";
// import { getShopById } from "../services/shop.service";
// import cloudinary from "cloudinary";





  //create product
  export const createShopProduct = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
 ////console.log('*********** аем==',req.body  );
////// console.log('*********** Uploaded files:', req.files);
            const shopId = req.body.shopId;
           
        // соединение с бд
        await connectDB();        
    const shop = await shopModel.findById(shopId);
 
 
    //console.log('shop=', shopId)  
      if (!shop) {    //магазина нет
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }  
         const files:any = req.files
  //           let images = [];
  //  if (typeof req.body.images === "string") {  images.push(req.body.images);}
  //        else { images = req.body.images; }
  //    const imagesLinks = [];
  //        for (let i = 0; i < images.length; i++) {
  //         const result = await cloudinary.v2.uploader.upload(images[i], {
  //           folder: "products",
  //         });
  //   imagesLinks.push({
  //           public_id: result.public_id,
  //           url: result.secure_url,
  //         });
       // 3] 01-46-45
   //---------сохраняем в -----cloudinary--------------------------------------- 

   if (!files || files.length === 0) {
    return next(new ErrorHandler("No files uploaded", 400));
  }

  const imagesLinks = [];
  for (let i = 0; i < files.length; i++) {
    const result = await cloudinary.v2.uploader.upload(
      `data:${files[i].mimetype};base64,${files[i].buffer.toString("base64")}`,
      {
        folder: "products",
      }
    );

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }


//--------------------------------------------------------------------------
     //из прешедших записываем имена  
 //---просто----замена--    const imagesLinks= files.map((file:any) => `${file.originalname}`)
     //  console.log('imageUrls:', imagesLinks);
       //  }
       


       
       //создание продукта   
          const productData = req.body;
          //добавлю  
           productData.images =   imagesLinks;
           productData.shop = shop;
   //сохраняем
           const product = await ProductModel.create(productData);
   //отвечаем

   res.status(201).json({ success: true, product,  });
 
} catch (error) {
    return next(new ErrorHandler(error, 400));
  }
})
 

 // get all products of a shop
 //все продукты магазина
 //router.get( "/get-all-products-shop/:id", 