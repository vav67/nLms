"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
}, { timestamps: true } //добавлено время записи);
);
const linkSchema = new mongoose_1.Schema({
    title: String,
    url: String,
});
// схема комментариев
const commentSchema = new mongoose_1.Schema({
    user: Object,
    question: String, //вопрос
    questionReplies: [Object], //ответы
}, { timestamps: true } //добавлено время записи
);
const courseDataSchema = new mongoose_1.Schema({
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
const courseSchema = new mongoose_1.Schema({
    name: { type: String, required: true, },
    description: { type: String, required: true, },
    categories: { type: String, required: true, }, //добавлено 09-07-30
    price: { type: Number, required: true, },
    estimatedPrice: { type: Number, },
    thumbnail: {
        public_id: { type: String, },
        url: { type: String, },
    },
    tags: { type: String, required: true, },
    level: { type: String, required: true, },
    demoUrl: { type: String, required: true, },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: { type: Number, default: 0, },
    purchased: { type: Number, default: 0, },
}, { timestamps: true });
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
//и мы можем экспортировать наше значение по умолчанию
