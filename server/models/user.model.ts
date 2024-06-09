require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"; //хешировать наш пароль
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  // было    inVerified: boolean;
// сам изменил
isVerified: boolean; // Заменил isVerified на inVerified

  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;   //токен доступа
  SignRefreshToken: () => string; // токен обновления
}

/**
 * Проблема здесь в том, что TypeScript ожидает, что тип 
 * свойства name будет просто string, но вы неправильно 
 * указали тип как объект со свойствами type и required.
 */

// было  const userSchema: Schema<IUser> = new mongoose.Schema(
//сам изменю на 
const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
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
    role:   {     type: String,   default: "user",    },
    isVerified: {    // если верифицирован , тогда покажем аккаунт
             type: Boolean,
             default: false,
    },
    courses: [  // массив курсов с индитификатором курса(если курс куплен то добавляем его индетификатор)
      {     // эндетиф-р проверяем , если такой есть значит ок - получит доступ к видео
        courseId: String,
      },
    ],
  },
  { timestamps: true } //добавление временных меток
);

//hash password berfore sharing  хэширование пароля
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
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
// userSchema.methods.SignAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "",
 //   {  expiresIn: "5m" });
// };

userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN as string,
  {  expiresIn: "5m" });
};

// sign refresh token
// userSchema.methods.SignRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "",
//   { expiresIn: "3d" });
// };

userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN as string,
  { expiresIn: "3d" });
};



// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
