import { Response } from "express";
 import { redis } from "../utils/redis";
 
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
//мы использем red


//мы использем redis поэтому заменим на    
export const getShopById = async (id: string, res: Response) => {

    //console.log( "получим с кэша redis, и пользователь передается в формате Json")
     // соединение с бд
     await connectDB();
  //  const userJson = await redis.get(id);
  const shopJson = await redis.get(`shop:${id}`);
  
  // получим с кэша redis, и пользователь передается в
   // формате Json
    if (shopJson) {
      const seller = JSON.parse(shopJson);
      res.status(201).json({ success: true, seller, });
    }
   
  
  };
  