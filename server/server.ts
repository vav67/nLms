import { app } from "./app";
import {v2 as cloudinary} from 'cloudinary'
            import http from "http";
import connectDB from "./utils/db"; 
           import { initSocketServer } from "./socketServer";

require("dotenv").config()

const startServer = async () => {  //заключаем   - добавлено робот

  const server = http.createServer(app);
 // Подключаемся к базе данных
       await connectDB();

//cloudinary config Настройка облачного хранилища Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_SECRET_KEY,
})

initSocketServer(server); // Инициализируем сокет-сервер


//create server  // Запускаем сервер на прослушивание порта
//app.listen(process.env.PORT, () => { приложение делаем сервером
  server.listen(process.env.PORT, () => {  
console.log(`Server is connected with port ${process.env.PORT}`);
   //// connectDB();
  });

}


// Запускаем сервер - робот предложил
startServer();