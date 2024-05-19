import { Response } from "express";
 import { redis } from "../utils/redis";
 import userModel from "../models/user.model";
 import connectDB from "../utils/db"; 

// получение пользователя по идентификатору
// из бд
//зам-м  export const getUserById = async (id: string, res: Response ) => {
//зам-м    const user = await userModel.findById(id)
//зам-м       res.status(201).json({
//зам-м         success: true,
//зам-м         user,
//зам-м       });
//зам-м      }
//мы использем redis поэтому заменим на    
export const getUserById = async (id: string, res: Response) => {

  console.log( "получим с кэша redis, и пользователь передается в формате Json")

  const userJson = await redis.get(id);
 // получим с кэша redis, и пользователь передается в
 // формате Json
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({ success: true, user, });
  }
};


// get all users
export const getAllUsersService = async (res: Response) => {
   // соединение с бд
   await connectDB();

 const users = await userModel.find().sort({ createdAt: -1 });
res.status(201).json({ success: true, users, });
};


//update user role изменение роли пользователя
export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
   // соединение с бд
   await connectDB();
   
// находим пользователя по id  и по роли обновит правило
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
 
  res.status(201).json({ success: true,  user,  });
};
