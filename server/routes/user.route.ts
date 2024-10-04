import express from "express";
import {
  registrationUser,
   activateUser,
  loginUser,
  logoutUser,
       updateAccessToken,
 getUserInfo,
      socialAuth,
  updateUserInfo,
   updateUserPassword,
    updateProfilePicture,

  getAllUsers,
     updateUserRole,
   deleteUser,
   cookieAuth,
   tttUser, ///сам

} from "../controllers/user.controller";

const userRouter = express.Router(); // маршрутизатор
//
 import { authorizeRoles, isAutheticated , isttt } from "../middleware/auth";




 userRouter.post("/registration", registrationUser);
  userRouter.post("/activate-user", activateUser);
  userRouter.post("/login", loginUser);

// userRouter.get("/logout", logoutUser);
 userRouter.get("/logout", isAutheticated, logoutUser);
// userRouter.get("/logout", isAutheticated, authorizeRoles("admin"), logoutUser);
 
userRouter.get("/refresh", updateAccessToken);


//userRouter.get("/me", isAutheticated, getUserInfo)
// 06-51-02 добавим  рефреш updateAccessToken, до аутентифик-и 
//  userRouter.get("/me", 
// //убрано в конце  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next();
// // и дальше новый accessToken в куки
//  isAutheticated, //проверка аутен-ции из кука
//  getUserInfo
//  )
 userRouter.get("/me", isAutheticated, getUserInfo);
 // userRouter.post("/me", isAutheticated, getUserInfo); //сам меняю
  
 userRouter.post("/ttt", isttt , tttUser) //добавил для пробы июнь 2024 

//----------------------------------------------
userRouter.get("/get-cookie", cookieAuth);


     userRouter.post("/social-auth", socialAuth);



  userRouter.put("/update-user-info", 
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated, updateUserInfo);
 

  userRouter.put("/update-user-password", 
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated, updateUserPassword)
 

  userRouter.put("/update-user-avatar",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated, updateProfilePicture);


 userRouter.get(
  "/get-users",
 // updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-user",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
