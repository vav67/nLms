import { Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orderModel";
import connectDB from "../utils/db"; 


export const newOrder = CatchAsyncError(
 // async (data: any, next: NextFunction) => {
   async (data: any, res: Response) => {
    // соединение с бд
  await connectDB();

     const order = await OrderModel.create(data) 
//next(order)
 res.status(201).json({ success: true, order,});
 });

// get all orders
export const getAllOrdersService = async (res: Response) => {
  // соединение с бд
  await connectDB();
     const orders= await OrderModel.find().sort({ createdAt: -1 });
 res.status(201).json({ success: true,  orders, });
};