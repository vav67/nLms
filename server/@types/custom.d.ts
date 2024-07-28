import { Request } from "express";
import { IUser } from "../models/user.model";
import { IShop } from "../models/shop.model";

//декларируем глобальное пространство имен записи - Express
declare global {
  namespace Express {
    interface Request {  //интерфейс есть такой
      user?: IUser;
      seller?: IShop;
    }
  }
}
