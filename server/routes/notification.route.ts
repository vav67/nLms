import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { 
  getNotifications, 
   updatedNotification 
} from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";
const notificationRouter = express.Router(); // маршрутизатор

notificationRouter.get(
  "/get-all-notification",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  getNotifications
);
notificationRouter.put(
  "/update-notification/:id",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
 updatedNotification 
);

export default notificationRouter;
