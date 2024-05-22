"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const order_service_1 = require("../services/order.service");
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получили
        const { courseId, payment_info } = req.body;
        //если получаем информацию об уплате
        //-----------------------------
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("Payment not authorized!", 400));
                }
            }
        }
        //-----------------------------------
        // соединение с бд
        await (0, db_1.default)();
        //найдем нашего пользователя
        const user = await user_model_1.default.findById(req.user?._id);
        console.log('=======================', user?.courses, '----курс user=', user?.name, "поста= ", user?.email);
        // ищем о покупке пользователем этого курса в его купленных курсов
        const courseExistInUser = user?.courses.some((course) => course._id.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("Вы уже приобрели этот курс You already purchased this course", 400));
        }
        // еще не оплачивал курс, ищем курс     
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const data = {
            courseId: course._id,
            userId: user?._id,
            payment_info, //платежная информ-я
        };
        //------------почта-----------------------------
        //соберем данные для почты  
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6), // 6цифр айди
                name: course.name, //назван курса
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
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email, //адрес электронной почты 
                    subject: "Order Confirmation", //тема
                    template: "order-confirmation.ejs", //имя шаблона
                    data: mailData, //данные
                });
                /** Таким образом, при вызове функции sendEmail, внутри этой
                 *  функции происходит рендеринг шаблона order-confirmation.ejs
                 * с данными из объекта mailData, и результирующий HTML
                 * используется для отправки электронного письма.
                 */
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        //----------------------------
        //добавим этот курс пользователю, что оплачен
        user?.courses.push(course?._id);
        // добавить на редис
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();
        //отправим уведомление нашему админу, что заказ создан и ок
        await notificationModel_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });
        //добавим , что еще один подписался ----------------------------------- 
        course.purchased ? (course.purchased += 1) : (course.purchased = 1);
        await course.save();
        (0, order_service_1.newOrder)(data, res, next); //в сервисе выведет созданный ордер
        /*
        06-45-05 Итак мы создали заказ с уведомлением по электронной почте заказчику
        и с уведомлением администратора по Notification
        */
        //  res.status(201).json({  success: true,  order: course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all orders--- only for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// оплата
//  send stripe publishble key отправляет публикуемый ключ
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
// new payment - для нового платежф
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //создание
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount, //тело
            currency: "USD", //валюта
            description: "E-learning course services",
            metadata: { company: "E-Learning", }, //компания    
            automatic_payment_methods: { enabled: true, }, //атоматич оплата
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
        res.status(201).json({ success: true, client_secret: myPayment.client_secret, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
