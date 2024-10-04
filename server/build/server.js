"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
// приостановил 03-10-2024  import { initSocketServer } from "./socketServer";
require("dotenv").config();
const startServer = async () => {
    const server = http_1.default.createServer(app_1.app);
    // Подключаемся к базе данных
    await (0, db_1.default)();
    //cloudinary config Настройка облачного хранилища Cloudinary
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_SECRET_KEY,
    });
    // приостановил 03-10-2024 initSocketServer(server); // Инициализируем сокет-сервер
    //create server  // Запускаем сервер на прослушивание порта
    //app.listen(process.env.PORT, () => { приложение делаем сервером
    server.listen(process.env.PORT, () => {
        console.log(`Server is connected with port ${process.env.PORT}`);
        //// connectDB();
    });
};
// Запускаем сервер - робот предложил
startServer();
