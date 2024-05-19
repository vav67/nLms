import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
 import { createCourse, getAllCoursesService } from "../services/course.service";
  import CourseModel from "../models/course.model";

  import connectDB from "../utils/db"; 
  import { redis } from "../utils/redis";
  import mongoose from "mongoose";
  
  import ejs from "ejs";
  import path from "path";
  import sendEmail from "../utils/sendMail";
  import NotificationModel from "../models/notificationModel";
 import SendmailTransport from "nodemailer/lib/sendmail-transport";
  import axios from "axios";



//create
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body; //получим как простые данные , а необъект (типа {data}   )
      const thumbnail = data.thumbnail; //миниатюра курса
      if (thumbnail) {
  //есть, то загружаем      
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      //создаем
      createCourse(data, res, next);

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//edit  - редактирование курса
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail; //получаем миниатюру

    //как параметр
 const courseId = req.params.id;//индетификатор курса

  // соединение с бд
  await connectDB();

 const courseData = await CourseModel.findById(courseId) as any;

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
  await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
    // пока на
     //   await cloudinary.v2.uploader.destroy(thumbnail.public_id);
  //обновим миниатюру в папке "courses"
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
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

  const course = await CourseModel.findByIdAndUpdate(
           courseId,   //индетинфикатор курса
         { $set: data, }, 
         { new: true } 
      );

// update course in redis
      await redis.set(courseId, JSON.stringify(course)); 

      res.status(201).json({ success: true, course, });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//одиночный курс - это для всех рарешено , просмотр но не весь
// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    try {
     const courseId = req.params.id;
//есть ли в редис
    const isCacheExist = await redis.get(courseId);
   

 //если есть , то   
      if (isCacheExist) {
    //тогда берем    
        const course = JSON.parse(isCacheExist);
   //ок, отдаем     
       res.status(200).json({ success: true,  course /*  */, });
      }   else {
          // соединение с бд
     await connectDB();
   //используем оператор выбора(из courseDataSchema неотправлять) -courseData.videoUrl ...      
        const course = await CourseModel.findById(req.params.id).select(
 "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
          );

      //const expirationInMilliseconds = 60 * 60 * 1000 один час  

//запишем в кэш редиса на хранение 7 дней ( если смотрят его то автоматом продливается)
  await redis.set(courseId, JSON.stringify(course), "EX", 604800); //7 days //save chase on redis
     
  res.status(200).json({  success: true,  course, });
     }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//вывод всех курсов
// get all course --- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        // соединение с бд
     await connectDB();
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
      const course = await CourseModel.find().select(
  "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
//запишем в кэш редиса на хранение
//он не захотел await redis.set("allCourses", JSON.stringify(course), "EX", 604800); //7 days //save chase on redis

  res.status(200).json({ success: true, course,}); // у него вместо course стоит courses

 // он не захотел  }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// пройти контент для платных пользователей
// get course content --- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
//курсы для юзера
      const userCourseList = req.user?.courses;
  //айди курса - код
      const courseId = req.params.id;
    // console.log( 'код курса courseId = ', courseId  )
      // соединение с бд
      await connectDB();
// ищем курс
      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) { //если курса нет ( пользователь не купил этот код)
        return next( // нет кодов к этому курсу
          new ErrorHandler("У вас нет доступа You are not eligible to access this course", 404)
        );
      }
    //тогда поиск этого курса  
      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;
      res.status(200).json({ success: true, content, });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course добавить вопрос в курс
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}
//добавление вопросов
export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
//получаем коды айди и наш контекст айди      
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      
       // соединение с бд
       await connectDB();

      const course = await CourseModel.findById(courseId);
//проверяем валидность 
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
//тогда ищем содержание нашего курса - совпадение
      const courseContent = course?.courseData?.find((item: any) =>
     // item._id === contentId  
      item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      //create a new question object создаем новый объект вопроса
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //add this question to our course content
      courseContent.questions.push(newQuestion);
  
//создаем уведомление , а поставленном вопросе к курсу      
     await NotificationModel.create({
        user: req.user?._id,
        title: "New question received",
        message: `You have a new question from ${courseContent.title}`,
      });

      // save the updated course
      await course?.save();
      res.status(200).json({ success: true,  course, });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// add answer in course question добавить ответ в вопрос курса
interface IAddAnswerData {
  answer: string;    // текст ответ
  courseId: string;
  contentId: string;
  questionId: string; //индетификатор вопроса
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    //получаем коды айди и наш контекст айди    
const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

  // соединение с бд
  await connectDB();

      const course = await CourseModel.findById(courseId);
//проверяем валидность 
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
//тогда ищем содержание нашего курса - совпадение
      const courseContent = course?.courseData?.find((item: any) =>
       // item._id === contentId   
      item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
//ищем вопрос в массиве вопросов по контенту курса
      const question = courseContent?.questions?.find((item: any) =>
        // item._id === contentId  
        item._id.equals(questionId)
      );

      if (!question) { //ошибка по вопросу
        return next(new ErrorHandler("Invalid content id", 400));
      }

      //create a new answer object
      const newAnswer: any = {
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
        await NotificationModel.create({
          user: req.user?._id,
          title: "New question received",
          message: `You have a new question from ${courseContent.title}`,
        });
      } else
      {// к вашему вопросу добавлен новый ответ
        console.log( '--------------добавлен новый ответ' )
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

    // добавляем шаблон для отправки почтой
        const html = await ejs.renderFile(
         path.join(__dirname, "../mails/question-reply.ejs"),
       data
     );
//console.log( 'отправка почты на ', question.user.email)
//---- отправка почты ----------
      try {
          await   sendEmail ({
            email: question.user.email,
            subject: "Question reply",
            template: "question-reply.ejs",
            data,
          });
          } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
           }
//------------------

      }

      res.status(200).json({  success: true,   course,   });
    
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


//добавляем отзыв о курсе
// add review in course
interface IAddReviewData {
  review: string;  //отзыв
  rating: string;
  userId: string;
}
export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      //chek if courseid already exists in userCourseList base on _id
//проверьте, существует ли идентификатор курса в базе userCourseList по _id      
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("Нет доступа к курсу You are not eligible to access this course", 404)
        );
      }

        // соединение с бд
     await connectDB();
      //найдем курс
      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;
//создадим объект для нашего отзыва
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
  // добавим наш отзыв
      course?.reviews.push(reviewData);
//рейтинг дальше
      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
   //one example, we have 2 review one is 5 onother on is 4 so math working 
   //   like this = 9/2 = 4.5 ratings
        course.ratings = avg / course.reviews.length; 
      }
//сохраним
      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      // create notification
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      });
      // const notification = {
      //   title: "New review received",
      //   message: `${req.user?.name} has given a review in ${course?.name}`,
      // };

      res.status(200).json({ success: true, course, });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);



// add reply in review добавить ответ в отзыв
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

  // соединение с бд
  await connectDB();

//найдем курс
      const course = await CourseModel.findById(courseId);
//если курса нету
      if (!course) { return next(new ErrorHandler("Course not found", 404));  }
//найдем нужный отзыв
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) { return next(new ErrorHandler("Review not found", 404)); }
      
//создаем объект коментария на отзыв
      const replyData: any = {
        user: req.user,
        comment,
        //добавим даты для правильного отображения в функции format
   createAt: new Date().toISOString(),
   updateAt: new Date().toISOString(),
      };
//если нет то создадим
      if (!review.commentReplies) { review.commentReplies = [];   }
//добавим
      review.commentReplies?.push(replyData);
//запишем
      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

           res.status(200).json({ success: true, course,});
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all courses --- only for admin
export const getAdminAllCourses= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete course--- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
        // соединение с бд
     await connectDB();
//ищем курс
      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
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
      await redis.del(id);

 res.status(201).json({success: true, message:"Course deleted successfully",});
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);



// generate video url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;//видеоиндетификатор
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
