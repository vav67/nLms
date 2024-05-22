"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router(); // маршрутизатор
//
const auth_1 = require("../middleware/auth");
userRouter.post("/registration", user_controller_1.registrationUser);
userRouter.post("/activate-user", user_controller_1.activateUser);
userRouter.post("/login", user_controller_1.loginUser);
// userRouter.get("/logout", logoutUser);
userRouter.get("/logout", auth_1.isAutheticated, user_controller_1.logoutUser);
// userRouter.get("/logout", isAutheticated, authorizeRoles("admin"), logoutUser);
userRouter.get("/refresh", user_controller_1.updateAccessToken);
//userRouter.get("/me", isAutheticated, getUserInfo)
// 06-51-02 добавим  рефреш updateAccessToken, до аутентифик-и 
//  userRouter.get("/me", 
// //убрано в конце  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next();
// // и дальше новый accessToken в куки
//  isAutheticated, //проверка аутен-ции из кука
//  getUserInfo
//  )
//userRouter.get("/me", isAutheticated, getUserInfo);
userRouter.post("/me", auth_1.isAutheticated, user_controller_1.getUserInfo); //сам меняю
//----------------------------------------------
userRouter.get("/get-cookie", user_controller_1.cookieAuth);
userRouter.post("/social-auth", user_controller_1.socialAuth);
userRouter.put("/update-user-info", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, user_controller_1.updateUserInfo);
userRouter.put("/update-user-password", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, user_controller_1.updateUserPassword);
userRouter.put("/update-user-avatar", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, user_controller_1.updateProfilePicture);
userRouter.get("/get-users", 
// updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.getAllUsers);
userRouter.put("/update-user", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.updateUserRole);
userRouter.delete("/delete-user/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), user_controller_1.deleteUser);
exports.default = userRouter;
