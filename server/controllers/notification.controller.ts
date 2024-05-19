import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notificationModel";

import connectDB from "../utils/db"; 

import cron from 'node-cron';


//get all norification -- only admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // соединение с бд
  await connectDB();
  // получение сортировка    
 const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });
 //получим отсортированные уведомления
res.status(201).json({success: true, notifications,});
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//обновление состояния уведомлений
// update notification status --- only admin
export const updatedNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
         // соединение с бд
  await connectDB();
   //ищем уведомление   
      const notification = await NotificationModel.findById(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
      } else {
// изменим статус уведомления на прочтенный
notification.status ? (notification.status = "read") : notification?.status;
      }

      await notification.save()
// отсортитруем
  const notifications = await NotificationModel.find().sort({ createdAt: -1, });
     
  res.status(201).json({ success: true,  notifications,  });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


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
