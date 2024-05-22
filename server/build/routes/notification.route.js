"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const notification_controller_1 = require("../controllers/notification.controller");
const user_controller_1 = require("../controllers/user.controller");
const notificationRouter = express_1.default.Router(); // маршрутизатор
notificationRouter.get("/get-all-notification", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), notification_controller_1.getNotifications);
notificationRouter.put("/update-notification/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), notification_controller_1.updatedNotification);
exports.default = notificationRouter;
