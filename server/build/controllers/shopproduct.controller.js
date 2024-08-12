"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopProduct = void 0;
require("dotenv").config(); //добавим  .env
// import User, { IUser } from "../models/user.model";
const shop_model_1 = __importDefault(require("../models/shop.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const db_1 = __importDefault(require("../utils/db"));
const product_model_1 = __importDefault(require("../models/product.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
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
exports.createShopProduct = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        ////console.log('*********** аем==',req.body  );
        ////// console.log('*********** Uploaded files:', req.files);
        const shopId = req.body.shopId;
        // соединение с бд
        await (0, db_1.default)();
        const shop = await shop_model_1.default.findById(shopId);
        //console.log('shop=', shopId)  
        if (!shop) { //магазина нет
            return next(new ErrorHandler_1.default("Shop Id is invalid!", 400));
        }
        const files = req.files;
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
            return next(new ErrorHandler_1.default("No files uploaded", 400));
        }
        const imagesLinks = [];
        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary_1.default.v2.uploader.upload(`data:${files[i].mimetype};base64,${files[i].buffer.toString("base64")}`, {
                folder: "products",
            });
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
        productData.images = imagesLinks;
        productData.shop = shop;
        //сохраняем
        const product = await product_model_1.default.create(productData);
        //отвечаем
        res.status(201).json({ success: true, product, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error, 400));
    }
});
// get all products of a shop
//все продукты магазина
//router.get( "/get-all-products-shop/:id", 
