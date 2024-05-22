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
/**
 * Проблема здесь в том, что TypeScript ожидает, что тип
 * свойства name будет просто string, но вы неправильно
 * указали тип как объект со свойствами type и required.
 */
// было  const userSchema: Schema<IUser> = new mongoose.Schema(
//сам изменю на 
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
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
        //  required: [true, "Please enter your password"],   не требуется тк социальный
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: { type: String, default: "user", },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        },
    ],
}, { timestamps: true } //добавление временных меток
);
//hash password berfore sharing  хэширование пароля
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
/**
 * В случае, когда время жизни токена устанавливается вручную в методе
 * SignAccessToken, значение из ACCESS_TOKEN_EXPIRE не учитывается.
 * Таким образом, время жизни токена в данном случае определяется только
 * указанным в методе expiresIn.
 * !!!!!! Имейте в виду, что токены будут обновляться каждый раз,
 * когда пользователь авторизуется с помощью токена обновления.
 *
 * JSON Web Token (JWT) - это компактный и самостоятельный способ
 * передачи информации между сторонами в виде объекта JSON.
 * Он может быть подписан, чтобы обеспечить его подлинность, и зашифрован,
 * чтобы обеспечить конфиденциальность. JWT состоит из трех
 * частей: заголовка, полезной нагрузки (payload) и подписи
 *         В вашем случае, полезная нагрузка (payload) это объект { id: this._id } т.е.
 *  содержит только идентификатор пользователя (_id). Когда токен доступа (access_token)
 * создается, он будет подписан с использованием этой полезной нагрузки
 *        Секретный ключ (secretOrPrivateKey):
 * Здесь используется process.env.ACCESS_TOKEN || "". Это значение берется из
 * переменной окружения ACCESS_TOKEN. Он используется для  подписи токена и
 * обеспечения его подлинности. Если значение process.env.ACCESS_TOKEN не
 * определено, будет использована пустая строка.
 *         И параметры токена (options): Это объект, который содержит дополнительные
 *  параметры для создания токена. В вашем случае, вы устанавливаете время жизни
 * токена с помощью параметра expiresIn: "20m", что означает, что токен будет
 * действителен в течение 20 минут.
 */
// sign access token
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "5m" //через пять минут 5m ставлю на 20m
    });
};
// sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: "3d" //через три дня
    });
};
// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
