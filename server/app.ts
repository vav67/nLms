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

  app.use(
    cors( 
      { origin: [ 'http://localhost:3000',  'https://nlmsclient.vercel.app', 'https://testclient-iota.vercel.app' ],
    credentials: true, //это передает куки и др.
    }
      
      )
);


// origin: [
//   'http://localhost:3000', 
//  'https://testclient-topaz.vercel.app', 
// 'rediss://default:9207eee037924cb29ea7c58425c3141b@worthy-tadpole-39390.upstash.io:39390',
//       ],

// body parser
app.use(express.json({ limit: "50mb" }))
//cookie parser
  app.use(cookieParser())
// cors => cross origin resource sharing
  // app.use(
  //     ///////cors({  origin: process.env.ORIGIN, })
  //     cors({
  //                                          // origin: ['http://localhost:3000'],
  //     origin: process.env.ORIGIN,
  //      credentials: true
  //    })
  //   )




 // api requests limit ограничение 15минут каждый IP максимум 100 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

//------------------------------------------------
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
// if (req.method == "OPTIONS") {
//   res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//   return res.status(200).json({});
// }

// next();
// });


//---------------------------------

//router
app.use( "/api/v1",
            userRouter,
   courseRouter,
   orderRouter,
   notificationRouter, //уведомления
   analyticsRouter,  //аналитика
    layoutRouter
 );




   //testing api - это тест API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    
  const acctoken = req.cookies //.access_token as string;
  res.status(200).json({
      success: true,
      message: "API is working-21may- 19:00 acctoken="+ acctoken ,
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