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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); //хешировать наш пароль
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const shopSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter your shop name!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your shop email address"],
        validate: {
            validator: function (value) {
                return emailRegexPattern.test(value);
            },
            message: "please enter a valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        // required: [true, "Please enter your password"],   не требуется тк социальный
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    description: { type: String, },
    address: { type: String, required: true, },
    phoneNumber: { type: Number, required: true, },
    role: { type: String, default: "Seller", },
    avatar: {
        public_id: { type: String, required: true, },
        url: { type: String, required: true, },
    },
    // avatar:{  type: String, },   //сам пока откоректировал 2 часть 4-22-46
    zipCode: { type: Number, required: true, },
    withdrawMethod: { type: Object, },
    availableBalance: { type: Number, default: 0, },
    transections: [
        {
            amount: { type: Number, required: true, },
            status: { type: String, default: "Processing", },
            createdAt: { type: Date, default: Date.now(), },
            updatedAt: { type: Date, },
        },
    ],
    // createdAt: { type: Date,  default: Date.now(),  },
    resetPasswordToken: String,
    resetPasswordTime: Date,
}, { timestamps: true } //добавление временных меток
);
//hash password berfore sharing  хэширование пароля
shopSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
// jwt token
// shopSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES,
//   });
// };
// заменяем на 
shopSchema.methods.ShopAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN, { expiresIn: "3d" });
};
shopSchema.methods.ShopRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN, { expiresIn: "6d" });
};
// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const shopModel = mongoose_1.default.model("Shop", shopSchema);
//module.exports = mongoose.model("Shop", shopSchema);
exports.default = shopModel;
