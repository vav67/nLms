import { Server as SocketIOServer } from "socket.io";
import http from "http";

//сокет работает без сервера - отправка и получение
export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server); //создаем новый сокет io

  io.on("connection", (socket) => {
   
    console.log("******************** A user connected сервер подключен");
    // Listen for 'notification' event from the frontend
    //Прослушивайте событие «уведомление» из внешнего интерфейса
    socket.on("notification", (data) => {
      // Broadcast the notification data to all connected clients (admin dashboard)
      //Распространение данных уведомления всем подключенным клиентам (панель администратора)
      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => { console.log("*************** A user disconnected");   });
  

  });


}
   