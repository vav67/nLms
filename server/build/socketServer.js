"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
//сокет работает без сервера - отправка и получение
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server); //создаем новый сокет io
    io.on("connection", (socket) => {
        console.log("******************** A user connected сервер подключен");
        // Listen for 'notification' event from the frontend
        //Прослушивайте событие «уведомление» из внешнего интерфейса
        socket.on("notification", (data) => {
            // Broadcast the notification data to all connected clients (admin dashboard)
            //Распространение данных уведомления всем подключенным клиентам (панель администратора)
            io.emit("newNotification", data);
        });
        socket.on("disconnect", () => { console.log("*************** A user disconnected"); });
    });
};
exports.initSocketServer = initSocketServer;
