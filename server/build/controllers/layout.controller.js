"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const db_1 = __importDefault(require("../utils/db"));
//create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // получим тип    
        const { type } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const isTypeExist = await layout_model_1.default.findOne({ type });
        //console.log(" тип isTypeExist=", isTypeExist )
        if (isTypeExist) {
            //  console.log(" тип НЕТНЕТ"  )   
            return next(new ErrorHandler_1.default(`${type} already exis уже существует`, 400));
        }
        if (type === "Banner") { //создаем свой баннер
            const { image, title, subTitle } = req.body;
            //получим изображение
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout",
            });
            //создаем
            const banner = {
                type: "Banner",
                banner: {
                    image: { public_id: myCloud.public_id, url: myCloud.secure_url, },
                    title,
                    subTitle,
                },
            };
            //сохраняем       
            await layout_model_1.default.create(banner);
        }
        if (type === "FAQ") { //вопрос - ответ
            const { faq } = req.body;
            //создадим объекты в массиве faq
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            //неправильно await LayoutModel.create( faq); 
            //добавим поле и наш массив с объектами    
            await layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") { //категормя
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return { title: item.title, };
            }));
            await layout_model_1.default.create({ type: "Categories", categories: categoriesItems, });
            //await LayoutModel.create( categories);
        }
        // console.log(" тип ПРОШЕЛ")
        res.status(200).json({ success: true, message: "Layour created successfully", });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//edit layout редактируем виджеты макета
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // // получим тип  
        const { type } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        if (type === "Banner") {
            const bannerData = await layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            // удаляем
            // await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            const data = image.startsWith("https")
                ? bannerData //да начинается, тогда это не оьновленно, это предыдущее
                : await cloudinary_1.default.v2.uploader.upload(image, { folder: "layout", });
            //загружаем новое изображ в наш макет 
            //const myCloud = await cloudinary.v2.uploader.upload(
            //     image, { folder: "layout",   }      );
            //создаем
            const banner = {
                type: "Banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };
            // обновляем      
            await layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner });
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            //находим
            const FaqItem = await layout_model_1.default.findOne({ type: "FAQ" });
            //создадим переменнную
            const faqItems = await Promise.all(
            //создадим объекты в массиве faq 
            faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            }));
            //сохраняем обновленную модель     
            await layout_model_1.default.findByIdAndUpdate(FaqItem?._id, {
                type: "FAQ",
                faq: faqItems,
            });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = await layout_model_1.default.findOne({
                type: "Categories",
            });
            // создадим переменную
            const categoriesItems = await Promise.all(
            //создадим объекты в массиве categories
            categories.map(async (item) => {
                return {
                    title: item.title,
                };
            }));
            //сохраняем обновленную модель           
            await layout_model_1.default.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layour Updated  successfully",
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get layout bu type  получим наш макет
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        console.log('======СЕРВЕР ------баннер--getLayoutByType');
        const { type } = req.params; //- это параметром
        //   const { type } = req.body  // - это внутри тела
        // соединение с бд
        await (0, db_1.default)();
        //выбираем нужный тип
        const layout = await layout_model_1.default.findOne({ type });
        console.log('баннер--getLayoutByType layout=', layout);
        res.status(201).json({ success: true, layout, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
