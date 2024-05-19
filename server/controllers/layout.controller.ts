import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import connectDB from "../utils/db"; 

//create layout
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
  // получим тип    
      const { type } = req.body;

    // соединение с бд
    await connectDB();

      const isTypeExist = await LayoutModel.findOne({ type });
//console.log(" тип isTypeExist=", isTypeExist )

      if (isTypeExist) {
      //  console.log(" тип НЕТНЕТ"  )   
        return next(new ErrorHandler(`${type} already exis уже существует`, 400));
      }

      if (type === "Banner") { //создаем свой баннер
        const { image, title, subTitle } = req.body;
//получим изображение
const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
//создаем
 const banner = {
  type: "Banner",
banner: {
   image: {public_id: myCloud.public_id, url: myCloud.secure_url,},
       title,
        subTitle,
          },
        };
 //сохраняем       
        await LayoutModel.create(banner);
      }

  if (type === "FAQ") { //вопрос - ответ
        const { faq } = req.body;
  
    //создадим объекты в массиве faq
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
  //неправильно await LayoutModel.create( faq); 
  //добавим поле и наш массив с объектами    
  await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }
    
      if (type === "Categories") { //категормя
        const { categories } = req.body;

        const categoriesItems = await Promise.all(
    categories.map(async (item: any) => {
            return { title: item.title,  };
          })
        );
await LayoutModel.create({ type: "Categories", categories: categoriesItems, })
//await LayoutModel.create( categories);
}
    
// console.log(" тип ПРОШЕЛ")
res.status(200).json({ success: true, message: "Layour created successfully", })

} catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//edit layout редактируем виджеты макета
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
   // // получим тип  
      const { type } = req.body;
   
    // соединение с бд
    await connectDB();

      if (type === "Banner") {
 const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
  const { image, title, subTitle } = req.body;
 // удаляем
  // await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
  
  const data = image.startsWith("https")
  ? bannerData //да начинается, тогда это не оьновленно, это предыдущее
  : await cloudinary.v2.uploader.upload(image, { folder: "layout",});
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
        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }

  if (type === "FAQ") {
        const { faq } = req.body;
     //находим
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
     //создадим переменнную
        const faqItems = await Promise.all(
    //создадим объекты в массиве faq 
 faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
   //сохраняем обновленную модель     
        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
// создадим переменную
  const categoriesItems = await Promise.all(
        //создадим объекты в массиве categories
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
  //сохраняем обновленную модель           
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }
      res.status(200).json({
        success: true,
        message: "Layour Updated  successfully",
      });
    } catch (error: any) { console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


//get layout bu type  получим наш макет
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('======СЕРВЕР ------баннер--getLayoutByType' )
      const { type } = req.params  //- это параметром
   //   const { type } = req.body  // - это внутри тела
  
  
    // соединение с бд
    await connectDB();
   //выбираем нужный тип
      const layout = await LayoutModel.findOne({ type });
 
      console.log('баннер--getLayoutByType layout=', layout )
  res.status(201).json({ success: true,   layout,  });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
