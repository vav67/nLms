import { Response } from "express";
 import { redis } from "../utils/redis";
 import User from "../models/user.model";
 import connectDB from "../utils/db"; 

 


// получение пользователя по идентификатору
// из бд
//зам-м  export const getUserById = async (id: string, res: Response ) => {
//зам-м    const user = await User.findById(id)
//зам-м       res.status(201).json({
//зам-м         success: true,
//зам-м         user,
//зам-м       });
//зам-м      }
//мы использем redis поэтому заменим на    
export const getUserById = async (id: string, res: Response) => {

  //console.log( "получим с кэша redis, и пользователь передается в формате Json")
   // соединение с бд
   await connectDB();
  const userJson = await redis.get(id);


 // получим с кэша redis, и пользователь передается в
 // формате Json
 let user
  if (userJson) {
      user = JSON.parse(userJson);
    res.status(201).json({ success: true, user, });
  } else
  {

   // соединение с бд
   await connectDB();

    user  = await User.findById( id)
//  запишем в редис
  // await redis.set(id, JSON.stringify(user));// запишем в кэш
    res.status(209).json({ success: true, user, }); 


   
  
  }
 

};


// get all users
export const getAllUsersService = async (res: Response) => {
   // соединение с бд
   await connectDB();

 const users = await User.find().sort({ createdAt: -1 });
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
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
 
  res.status(201).json({ success: true,  user,  });
};

//добавим фиксацию магазина
//shopseller:{  //создан ли свой магазин
export const updateUserShopService = async (
  res: Response,
  id: string 
  
) => {
  const shopseller = true;
   // соединение с бд
   await connectDB();
 //  console.log( " попытка обновить вызываем правило обновлений")
// находим пользователя по id  и по роли обновит правило
  const user = await User.findByIdAndUpdate(id, { shopseller }, { new: true });
 // изменения юзера запишем
  await redis.set(id, JSON.stringify(user));// запишем в кэш

 // нет так как создается магазин res.status(201).json({ success: true,  user,  });
  res.status(201).json({ success: true   });
};
