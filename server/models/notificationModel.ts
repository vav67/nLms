import mongoose, { Document, Model, Schema } from "mongoose";
//import cron from "node-cron";

export interface INotification extends Document {
  title: string;  //название
  message: string; //сообщение
  status: string;  //статус тип
  userId: string;
}
//схема уведомлений
const notificationSchema = new Schema<INotification>(
  {
    title: { type: String,   required: true,  },
  message: { type: String,   required: true,  },
   status: { type: String,   required: true,  default: "unread", },
  },
  { timestamps: true }
);
const NotificationModel: Model<INotification> = mongoose.model(
    "Notification",  notificationSchema  );

  export default NotificationModel;

//delete notification -- only admin
// cron.schedule("0 0 0 * * *", async () => {
//   const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//   await NotificationModel.deleteMany({
//     status: "read",
//     createdAt: { $lt: thirtyDaysAgo },
//   });
//   console.log('Deleted read notifications')
// });
