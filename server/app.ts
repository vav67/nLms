require("dotenv").config(); //подключаем .env
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors"
import cookieParser from "cookie-parser"
//--------вывод ошибок
import { ErrorMiddleware } from "./middleware/error";

import userRouter from "./routes/user.route";
 import courseRouter from "./routes/course.route";
 import orderRouter from "./routes/order.route";
 import notificationRouter from "./routes/notification.route";
 import analyticsRouter from "./routes/analytics.route";
  import layoutRouter from "./routes/layout.route";
  import { rateLimit } from 'express-rate-limit'  //ограничение против спама
import shopRouter from "./routes/shop.route";
  import shopproductRouter from "./routes/shopproduct.route";
import { redis } from "./utils/redis";
 


  //const allowedOrigins = process.env.ORIGIN 
  
//const allowedOrigins = ['http://localhost:3000' ];
  // app.use(cors({

  //   origin: function(origin, callback){
  //     // разрешаем запросы без происхождения
  //      // (например, мобильные приложения или запросы на curl)
  //     if(!origin) return callback(null, true);
      
  //     if(allowedOrigins.indexOf(origin)  === -1){
  //       var msg = 'The CORS policy for this site does not ' +
  //                 'allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   },
  
   
  
  //   credentials: true,
  // }));
  //origin - настраивает заголовок Access-Control-Allow-Origin. 
//'http://localhost:3000', 
  app.use(
    cors( 
      { origin: [  'https://nlmserver.vercel.app/', 'http://localhost:3000',
       'https://nlmsclient.vercel.app', 'https://testclient-iota.vercel.app' ],
    credentials: true, //это передает куки и др.
              methods:['GET','POST','PUT','DELETE']  //сам добавил https://github.com/vercel/next.js/discussions/36487
  }
   
      )
);


 

// body parser
app.use(express.json({ limit: "50mb" }))
//cookie parser
  app.use(cookieParser())
 




 // api requests limit ограничение 15минут каждый IP максимум 100 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

 

//router
app.use( "/api/v1",
            userRouter,
   courseRouter,
   orderRouter,
   notificationRouter, //уведомления
   analyticsRouter,  //аналитика
    layoutRouter,
   //--------------------магазин  
    shopRouter,
    shopproductRouter
 );




   //testing api - это тест API
app.get("/test",  async(req: Request, res: Response, next: NextFunction) => {
    
 const acc = req.cookies.access_token as string;
 //const acc = JSON.parse(req.cookies.get('access_token')?.value || 'no')
// соединение с бд
 //  await connectDB();
//  запишем в редис
  await redis.set("idtest", JSON.stringify(acc));// запишем в кэш

  res.status(200).json({
      success: true,
      message: "API is  idtest=redis=OK working-04-10 - 20:20 acctoken="+ acc ,
    });

  });
  
//бывает что не правильно набрали адрес пути, отобразим ошибку
  //unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  try {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
  } catch (error: any) {
         return  (error.message, 409)
  }
  });

  
  // middleware calls
app.use(limiter); // защита от спама
  app.use(ErrorMiddleware); //--------вывод ошибок вывод 