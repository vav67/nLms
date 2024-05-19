import express from "express";
//import { deleteCourse, getAllCoursesAdminOnly } from './../controllers/course.controller';
import { authorizeRoles, isAutheticated } from "../middleware/auth";

import {
uploadCourse,
editCourse,
    getSingleCourse,
  getAllCourses,
    getCourseByUser,

    addQuestion,
    addAnswer,
  addReview,

  addReplyToReview,
 
   getAdminAllCourses,
   deleteCourse,
 
   generateVideoUrl, 
  
   
} from "../controllers/course.controller"
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router(); // маршрутизатор

// при создании курса не хватает времени обновления - время жизни короткого 
// токена (происходящее при обновлении страницы и короткий токен бы обновлялся )
//поэтому добавим рефреш updateAccessToken, до аутентифик-и 
courseRouter.post(   "/create-course",
      updateAccessToken,  //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next();
 // и дальше новый accessToken в куки
       isAutheticated,  //проверка аутен-ции из кука
  authorizeRoles("admin"), //проверка роли - только админ
  uploadCourse    //выполнение
);
courseRouter.put(  "/edit-course/:id",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);

//каждый может зайти на эту страницу
courseRouter.get("/get-course/:id", getSingleCourse);


courseRouter.get( "/get-course-content/:id",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  getCourseByUser
);

courseRouter.get("/get-courses", getAllCourses);
 
courseRouter.get("/get-admin-courses",
//сам пока добавлю updateAccessToken
       updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
isAutheticated,
authorizeRoles("admin"), 
getAdminAllCourses
);
 


courseRouter.put( "/add-question",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  addQuestion
);

courseRouter.put("/add-answer",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
 isAutheticated,
  addAnswer
  );

courseRouter.put( "/add-review/:id",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  addReview
);

courseRouter.put( "/add-reply",
updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
   isAutheticated,
   authorizeRoles("admin"),
   addReplyToReview
 );





courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

// показываем для демонстрации и isAutheticated - ненужен
  courseRouter.post("/getVdoCipherOTP", generateVideoUrl );

  


export default courseRouter;
