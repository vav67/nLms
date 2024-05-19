import { Response } from "express";
import CourseModel from "../models/course.model";
import connectDB from "../utils/db"; 

import { CatchAsyncError } from "../middleware/catchAsyncErrors";
//создание курса
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    // соединение с бд
  await connectDB();

    const course = await CourseModel.create(data);

 res.status(201).json({  success: true, course, });
  }
);

// get all courses 
export const getAllCoursesService = async (res: Response) => {

  // соединение с бд
  await connectDB();
  
  const courses= await CourseModel.find().sort({ createdAt: -1 });
 
  res.status(201).json({ success: true,  courses,  });
};