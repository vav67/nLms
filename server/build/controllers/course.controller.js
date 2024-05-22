"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourses = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("./../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const axios_1 = __importDefault(require("axios"));
//create
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body; //получим как простые данные , а необъект (типа {data}   )
        const thumbnail = data.thumbnail; //миниатюра курса
        if (thumbnail) {
            //есть, то загружаем      
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        //создаем
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//edit  - редактирование курса
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail; //получаем миниатюру
        //как параметр
        const courseId = req.params.id; //индетификатор курса
        // соединение с бд
        await (0, db_1.default)();
        const courseData = await course_model_1.default.findById(courseId);
        //------сам сравню минюатюры ---------------------------
        // if (thumbnail === courseData.thumbnail) {
        //   console.log( '!!!!!!!! миниатюры равны thumbnail=',
        //      thumbnail, 'и ====',courseData.thumbnail)
        // } else {
        //   console.log( '!!!!!!!! миниатюры НЕРАВНЫ  thumbnail=',
        //      thumbnail, 'и ====',courseData.thumbnail)
        // }
        //-------------------------------
        if (thumbnail && !thumbnail.startsWith("https")) {
            //if (thumbnail) {      
            //вначале удалим минюатюру      
            await cloudinary_1.default.v2.uploader.destroy(courseData.thumbnail.public_id);
            // пока на
            //   await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            //обновим миниатюру в папке "courses"
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            //добавим миниатюру
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url,
            };
        }
        const course = await course_model_1.default.findByIdAndUpdate(courseId, //индетинфикатор курса
        { $set: data, }, { new: true });
        // update course in redis
        await redis_1.redis.set(courseId, JSON.stringify(course));
        res.status(201).json({ success: true, course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//одиночный курс - это для всех рарешено , просмотр но не весь
// get single course --- without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        //есть ли в редис
        const isCacheExist = await redis_1.redis.get(courseId);
        //если есть , то   
        if (isCacheExist) {
            //тогда берем    
            const course = JSON.parse(isCacheExist);
            //ок, отдаем     
            res.status(200).json({ success: true, course /*  */, });
        }
        else {
            // соединение с бд
            await (0, db_1.default)();
            //используем оператор выбора(из courseDataSchema неотправлять) -courseData.videoUrl ...      
            const course = await course_model_1.default.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            //const expirationInMilliseconds = 60 * 60 * 1000 один час  
            //запишем в кэш редиса на хранение 7 дней ( если смотрят его то автоматом продливается)
            await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7 days //save chase on redis
            res.status(200).json({ success: true, course, });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//вывод всех курсов
// get all course --- without purchasing
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // соединение с бд
        await (0, db_1.default)();
        //есть ли в редис
        // он не захотел const isCacheExist = await redis.get("allCourses");
        //если есть , то   
        // он не захотел     if (isCacheExist) {
        //тогда берем    
        // он не захотел       const course = JSON.parse(isCacheExist);
        //ок, отдаем     
        // он не захотел      res.status(200).json({ success: true,  course , });
        // он не захотел      }   else {
        //используем оператор выбора(из courseDataSchema неотправлять) -courseData.videoUrl ...       
        const course = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        //запишем в кэш редиса на хранение
        //он не захотел await redis.set("allCourses", JSON.stringify(course), "EX", 604800); //7 days //save chase on redis
        res.status(200).json({ success: true, course, }); // у него вместо course стоит courses
        // он не захотел  }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// пройти контент для платных пользователей
// get course content --- only for valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //курсы для юзера
        const userCourseList = req.user?.courses;
        //айди курса - код
        const courseId = req.params.id;
        // console.log( 'код курса courseId = ', courseId  )
        // соединение с бд
        await (0, db_1.default)();
        // ищем курс
        const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);
        if (!courseExists) { //если курса нет ( пользователь не купил этот код)
            return next(// нет кодов к этому курсу
            new ErrorHandler_1.default("У вас нет доступа You are not eligible to access this course", 404));
        }
        //тогда поиск этого курса  
        const course = await course_model_1.default.findById(courseId);
        const content = course?.courseData;
        res.status(200).json({ success: true, content, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//добавление вопросов
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получаем коды айди и наш контекст айди      
        const { question, courseId, contentId } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const course = await course_model_1.default.findById(courseId);
        //проверяем валидность 
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //тогда ищем содержание нашего курса - совпадение
        const courseContent = course?.courseData?.find((item) => 
        // item._id === contentId  
        item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //create a new question object создаем новый объект вопроса
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        //add this question to our course content
        courseContent.questions.push(newQuestion);
        //создаем уведомление , а поставленном вопросе к курсу      
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New question received",
            message: `You have a new question from ${courseContent.title}`,
        });
        // save the updated course
        await course?.save();
        res.status(200).json({ success: true, course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addAnswer = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        //получаем коды айди и наш контекст айди    
        const { answer, courseId, contentId, questionId } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        const course = await course_model_1.default.findById(courseId);
        //проверяем валидность 
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //тогда ищем содержание нашего курса - совпадение
        const courseContent = course?.courseData?.find((item) => 
        // item._id === contentId   
        item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //ищем вопрос в массиве вопросов по контенту курса
        const question = courseContent?.questions?.find((item) => 
        // item._id === contentId  
        item._id.equals(questionId));
        if (!question) { //ошибка по вопросу
            return next(new ErrorHandler_1.default("Invalid content id", 400));
        }
        //create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            //добавим даты для правильного отображения в функции format
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        };
        //add this answer to our course content
        //добавляем ответ в массив
        question.questionReplies.push(newAnswer);
        //и сохраняем курс
        await course?.save();
        //нужно создать уведомление 05-39-51  
        if (req.user?._id === question.user._id) {
            //айди юзера совпало с айди ответа юзера        
            //create notification
            // console.log( '---------------create notification' )
            await notificationModel_1.default.create({
                user: req.user?._id,
                title: "New question received",
                message: `You have a new question from ${courseContent.title}`,
            });
        }
        else { // к вашему вопросу добавлен новый ответ
            console.log('--------------добавлен новый ответ');
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            // добавляем шаблон для отправки почтой
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            //console.log( 'отправка почты на ', question.user.email)
            //---- отправка почты ----------
            try {
                await (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
            //------------------
        }
        res.status(200).json({ success: true, course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        //chek if courseid already exists in userCourseList base on _id
        //проверьте, существует ли идентификатор курса в базе userCourseList по _id      
        const courseExists = userCourseList?.some((course) => course._id.toString() === courseId.toString());
        if (!courseExists) {
            return next(new ErrorHandler_1.default("Нет доступа к курсу You are not eligible to access this course", 404));
        }
        // соединение с бд
        await (0, db_1.default)();
        //найдем курс
        const course = await course_model_1.default.findById(courseId);
        const { review, rating } = req.body;
        //создадим объект для нашего отзыва
        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
        // добавим наш отзыв
        course?.reviews.push(reviewData);
        //рейтинг дальше
        let avg = 0;
        course?.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            //one example, we have 2 review one is 5 onother on is 4 so math working 
            //   like this = 9/2 = 4.5 ratings
            course.ratings = avg / course.reviews.length;
        }
        //сохраним
        await course?.save();
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days
        // create notification
        await notificationModel_1.default.create({
            user: req.user?._id,
            title: "New Review Received",
            message: `${req.user?.name} has given a review in ${course?.name}`,
        });
        // const notification = {
        //   title: "New review received",
        //   message: `${req.user?.name} has given a review in ${course?.name}`,
        // };
        res.status(200).json({ success: true, course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReplyToReview = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        // соединение с бд
        await (0, db_1.default)();
        //найдем курс
        const course = await course_model_1.default.findById(courseId);
        //если курса нету
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        //найдем нужный отзыв
        const review = course?.reviews?.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 404));
        }
        //создаем объект коментария на отзыв
        const replyData = {
            user: req.user,
            comment,
            //добавим даты для правильного отображения в функции format
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        };
        //если нет то создадим
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        //добавим
        review.commentReplies?.push(replyData);
        //запишем
        await course?.save();
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days
        res.status(200).json({ success: true, course, });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all courses --- only for admin
exports.getAdminAllCourses = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete course--- only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        // соединение с бд
        await (0, db_1.default)();
        //ищем курс
        const course = await course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        //---сам пытаюсь удалить миниатюру----------------------------------------
        /////п const thumbnail = data.thumbnail; //получаем миниатюру
        //как параметр
        /////п const courseId = req.params.id;//индетификатор курса
        /////п const courseData = await CourseModel.findById(courseId) as any;
        //------сам сравню минюатюры ---------------------------
        // if (thumbnail === courseData.thumbnail) {
        //   console.log( '!!!!!!!! миниатюры равны thumbnail=',
        //      thumbnail, 'и ====',courseData.thumbnail)
        // } else {
        //   console.log( '!!!!!!!! миниатюры НЕРАВНЫ  thumbnail=',
        //      thumbnail, 'и ====',courseData.thumbnail)
        // }
        //-------------------------------
        /////п if (thumbnail && !thumbnail.startsWith("https")) {
        //if (thumbnail) {      
        //вначале удалим минюатюру      
        /////п await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        // пока на
        //   await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        //обновим миниатюру в папке "courses"
        /////п    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        /////п      folder: "courses",
        /////п   });
        //-------------------------------------------------------------
        //удаляем
        await course.deleteOne({ id });
        //также удалим в кеше redis
        await redis_1.redis.del(id);
        res.status(201).json({ success: true, message: "Course deleted successfully", });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// generate video url
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { videoId } = req.body; //видеоиндетификатор
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
