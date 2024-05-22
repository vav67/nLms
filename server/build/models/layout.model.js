"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//ответы
const faqSchema = new mongoose_1.Schema({
    question: { type: String },
    answer: { type: String },
});
//категории
const categorySchema = new mongoose_1.Schema({
    title: { type: String },
});
const bannerImageSchema = new mongoose_1.Schema({
    public_id: { type: String },
    url: { type: String },
});
//наш макет
const layoutSchema = new mongoose_1.Schema({
    type: { type: String },
    faq: [faqSchema], //будут часто задаваемые вопросы
    categories: [categorySchema],
    banner: {
        image: bannerImageSchema,
        title: { type: String }, //заголовок
        subTitle: { type: String } //подзаголовок
    }
});
const LayoutModel = (0, mongoose_1.model)('Layout', layoutSchema);
exports.default = LayoutModel;
