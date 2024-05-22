"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedNotification = exports.getNotifications = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const db_1 = __importDefault(require("../utils/db"));
//get all norification -- only admin
exports.getNotifications = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // соединение с бд
        await (0, db_1.default)();
        // получение сортировка    
        const notifications = await notificationModel_1.default.find().sort({
            createdAt: -1,
        });
        //получим отсортированные уведомления
        res.status(201).json({ success: true, notifications, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//обновление состояния уведомлений
// update notification status --- only admin
exports.updatedNotification = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // соединение с бд
        await (0, db_1.default)();
        //ищем уведомление   
        const notification = await notificationModel_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Notification not found", 404));
        }
        else {
            // изменим статус уведомления на прочтенный
            notification.status ? (notification.status = "read") : notification?.status;
        }
        await notification.save();
        // отсортитруем
        const notifications = await notificationModel_1.default.find().sort({ createdAt: -1, });
        res.status(201).json({ success: true, notifications, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//как простейший пример
// cron.schedule('*/5 * * * * *', function() { //через каждые 5 сек
//   console.log("-------cron---------")
//   console.log("- running cron---------")
//   console.log("--1---cron---------")
//   console.log("2-----cron---------")
//   console.log("--3-----cron---------")
// })
//подключать если нужно удаление месячной давности
// delete notification --- only admin
//пока ненадо  cron.schedule('0 0 * * *', async () => { //каждый день в полночь
//    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);  
// // удалять в разницу 30 дней   
// await NotificationModel.deleteMany({ status:"read",
//             createdAt: { $lt: thirtyDaysAgo } }); 
// //   await NotificationModel.deleteMany({ createdAt: { $lt: thirtyDaysAgo } }); 
//    console.log('Delete read notifications');
//  });
