import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import   { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
  import path from "path";
  import ejs from "ejs";
  import sendEmail from "../utils/sendMail";
  import { getAllOrdersService, newOrder } from "../services/order.service";
      import NotificationModel from "../models/notificationModel";
      
      import connectDB from "../utils/db"; 
      import { redis } from "../utils/redis";

      require("dotenv").config();
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




  //create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //получили
      const { courseId, payment_info } = req.body as IOrder;
//если получаем информацию об уплате
//-----------------------------
if (payment_info) {
  if ("id" in payment_info) {
    const paymentIntentId = payment_info.id;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      return next(new ErrorHandler("Payment not authorized!", 400));
    }
  }
}

//-----------------------------------

  // соединение с бд
  await connectDB();

//найдем нашего пользователя
      const user = await userModel.findById(req.user?._id);
console.log( '=======================',user?.courses,'----курс user=', user?.name,"поста= ", user?.email)

// ищем о покупке пользователем этого курса в его купленных курсов
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
        
      if (courseExistInUser) {
        return next(new ErrorHandler("Вы уже приобрели этот курс You already purchased this course", 400));
     }
 // еще не оплачивал курс, ищем курс     
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info, //платежная информ-я
      };
//------------почта-----------------------------
    //соберем данные для почты  
        const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),// 6цифр айди
          name: course.name,  //назван курса
          price: course.price, //цена
 //дата создания заказа
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
/*
EJS позволяет вам создавать динамические HTML-страницы, встраивая 
данные в шаблоны на серверной стороне перед их отправкой клиен
 в вашем случае, переменная mailData содержит данные о заказе,
  которые вставляются в шаблон order-confirmation.ejs
 */

//сама страница рендерим HTML-шаблон, используя данные, переданные вторым аргументом
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendEmail({
            email: user.email, //адрес электронной почты 
            subject: "Order Confirmation",//тема
            template: "order-confirmation.ejs",//имя шаблона
            data: mailData, //данные
          });
 /** Таким образом, при вызове функции sendEmail, внутри этой
  *  функции происходит рендеринг шаблона order-confirmation.ejs 
  * с данными из объекта mailData, и результирующий HTML 
  * используется для отправки электронного письма.
  */
    }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
//----------------------------
 

//добавим этот курс пользователю, что оплачен
       user?.courses.push(course?._id);

// добавить на редис
await redis.set(req.user?._id, JSON.stringify(user));
      
       await user?.save();
//отправим уведомление нашему админу, что заказ создан и ок
      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

//добавим , что еще один подписался ----------------------------------- 
       course.purchased ? (course.purchased += 1) : (course.purchased = 1);
      await course.save();

       newOrder(data, res, next); //в сервисе выведет созданный ордер
/*
06-45-05 Итак мы создали заказ с уведомлением по электронной почте заказчику
и с уведомлением администратора по Notification
*/
     //  res.status(201).json({  success: true,  order: course, });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


//get all orders--- only for admin
export const getAllOrders= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// оплата

//  send stripe publishble key отправляет публикуемый ключ
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment - для нового платежф
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //создание
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount, //тело
        currency: "USD",  //валюта
        description: "E-learning course services",
        metadata: { company: "E-Learning", },//компания    
        automatic_payment_methods: { enabled: true,},  //атоматич оплата
      //   shipping: {
      //     name: "Harmik Lathiya",
      //     address: {
      //       line1: "510 Townsend St",
      //       postal_code: "98140",
      //       city: "San Francisco",
      //       state: "CA",
      //       country: "US",
      //     },
      //   },

      });
      res.status(201).json({ success: true,  client_secret: myPayment.client_secret,  });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);