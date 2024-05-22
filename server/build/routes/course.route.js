"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { deleteCourse, getAllCoursesAdminOnly } from './../controllers/course.controller';
const auth_1 = require("../middleware/auth");
const course_controller_1 = require("../controllers/course.controller");
const user_controller_1 = require("../controllers/user.controller");
const courseRouter = express_1.default.Router(); // маршрутизатор
// при создании курса не хватает времени обновления - время жизни короткого 
// токена (происходящее при обновлении страницы и короткий токен бы обновлялся )
//поэтому добавим рефреш updateAccessToken, до аутентифик-и 
courseRouter.post("/create-course", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next();
// и дальше новый accessToken в куки
auth_1.isAutheticated, //проверка аутен-ции из кука
(0, auth_1.authorizeRoles)("admin"), //проверка роли - только админ
course_controller_1.uploadCourse //выполнение
);
courseRouter.put("/edit-course/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.editCourse);
//каждый может зайти на эту страницу
courseRouter.get("/get-course/:id", course_controller_1.getSingleCourse);
courseRouter.get("/get-course-content/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, course_controller_1.getCourseByUser);
courseRouter.get("/get-courses", course_controller_1.getAllCourses);
courseRouter.get("/get-admin-courses", 
//сам пока добавлю updateAccessToken
user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.getAdminAllCourses);
courseRouter.put("/add-question", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, course_controller_1.addQuestion);
courseRouter.put("/add-answer", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, course_controller_1.addAnswer);
courseRouter.put("/add-review/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, course_controller_1.addReview);
courseRouter.put("/add-reply", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.addReplyToReview);
courseRouter.delete("/delete-course/:id", user_controller_1.updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.deleteCourse);
// показываем для демонстрации и isAutheticated - ненужен
courseRouter.post("/getVdoCipherOTP", course_controller_1.generateVideoUrl);
exports.default = courseRouter;
