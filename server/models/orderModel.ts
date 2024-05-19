import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  courseId: string; //идентиф-р курса
  userId?: string;
  payment_info: object; //платежная информация
}
// схема заказа
const orderSchema = new Schema<IOrder>(
  {
    courseId: {  type: String,   required: true,   }, 
      userId: {  type: String,   required: true,   },
payment_info: {  type: Object,                     },
  },
  {   timestamps: true             }
);
const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);
export default OrderModel;
