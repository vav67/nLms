import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

//интерфейс коментирования
export interface IComment extends Document {
  user: IUser;
  question: string; //вопрос
  questionReplies: IComment[];
}
//интерфейс на документ - схема вопроса
interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[]; //к интерфейс коментирования
} 
//интерфейс ссылка - Url нашей ссылки
interface ILink extends Document {
  title: string;
  url: string;
}
//интерфейс  данные курса - которые обмениваються нашими документами
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object; //миниатюра видео
  videoSection: string; //раздел видео
  videoLength: number; //длина видео
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];//вопросы
}


export interface ICourse extends Document {
  name: string;  //название курса
  description: string;
       categories: string;  //категории  добавлено 09-07-30
  price: number;  // цена с учетом скидок
  estimatedPrice?: number; //приблизительная цена
  thumbnail: object; //миниатюра
  tags: string; //тэги
  level: string; //уровень новичок , средний или мастер
  demoUrl: string;
  benefits: string; //массив предварительных требований
  prerequisites: { title: string }[];//массив преимуществ
  reviews: IReview[];  //обзор
  courseData: ICourseData[]; //массив данных курса
  ratings?: number;  //рейтинг
  purchased?: number;// сколько пользователей купило
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
}, {timestamps: true} //добавлено время записи);
)


const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

// схема комментариев
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,  //вопрос
  questionReplies: [Object], //ответы
}, {timestamps: true} //добавлено время записи
);

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number, //Длина нашего видео - число
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema], //вопросы
});

const courseSchema = new Schema<ICourse>({
     name: {  type: String,  required: true,  },
description: {type: String,  required: true,  },

categories:{  type:String,  required: true,   },  //добавлено 09-07-30

     price: {  type: Number,  required: true,  },
estimatedPrice:{type: Number, },
    thumbnail: {
         public_id: { type: String,  },
               url: { type: String,  },
               },
         tags: { type: String,  required: true,  },
        level: { type: String,  required: true,  },
      demoUrl: { type: String,  required: true,  },
     benefits: [{ title: String }  ],
prerequisites: [{ title: String }  ],
      reviews: [reviewSchema],
   courseData: [courseDataSchema],
      ratings: { type: Number,  default: 0,  },
    purchased: { type: Number,  default: 0,  },
},
{timestamps:true});

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
export default CourseModel;
//и мы можем экспортировать наше значение по умолчанию