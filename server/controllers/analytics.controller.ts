import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./../middleware/catchAsyncErrors";
import { generateLast12MonthsDate } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/orderModel";

//get users analytisc == only for admin
export const getUsersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

 const users = await generateLast12MonthsDate(userModel);

res.status(200).json({ success: true,   users, });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get courses analytisc == only for admin
export const getCoursesAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses= await generateLast12MonthsDate(CourseModel);
 res.status(200).json({ success: true, courses, });

} catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get orders analytisc == only for admin
export const getOrdersAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    const orders = await generateLast12MonthsDate(OrderModel);
 res.status(200).json({ success: true,  orders,  });

} catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
