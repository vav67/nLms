require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"; //хешировать наш пароль
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IShop extends Document {
    name: string;
    email: string;
    password: string;
    description:  string;
    address:   string;
    phoneNumber: number ;
    role:  string;  
    avatar: string; //сам пока откоректировал 
    // avatar: {
    //   public_id: string;
    //   url: string;
    // };
   
    // было    inVerified: boolean;
  // сам изменил
 ////// isVerified: boolean; // Заменил isVerified на inVerified
 zipCode: number ;
 withdrawMethod: Object;
 availableBalance: number ;
 transections:Array< {
    amount:number;
    status: string;
 createdAt: Date;
 updatedAt: Date;
 }>;

    // courses: Array<{ courseId: string }>;

   //продавец забыл пароль  
    resetPasswordToken: String;
    resetPasswordTime: Date;  
    
    comparePassword: (password: string) => Promise<boolean>;
    ShopAccessToken: () => string;   //токен доступа магазина
    ShopRefreshToken: () => string; // токен обновления магазина

 

  }





const shopSchema = new Schema<IShop>({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
 

  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
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
 // required: [true, "Please enter your password"],   не требуется тк социальный
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  description: { type: String,  },
  address:     { type: String,  required: true,    },
  phoneNumber: { type: Number,  required: true,    },
  role:        { type: String,  default: "Seller", },
  // avatar:      {
  //     public_id: { type: String,  required: true, },
  //           url: { type: String,  required: true, },
  //             },
  avatar:{  type: String, },   //сам пока откоректировал 2 часть 4-22-46

  zipCode:          { type: Number,   required: true,  },
  withdrawMethod:   { type: Object,  },
  availableBalance: { type: Number,  default: 0,    },
  transections: [
         { 
              amount: { type: Number, required: true,  },
              status: { type: String, default: "Processing", },
           createdAt: { type: Date,   default: Date.now(),   },
           updatedAt: { type: Date,     },
           },
              ],
 // createdAt: { type: Date,  default: Date.now(),  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
},
{ timestamps: true } //добавление временных меток
);


//hash password berfore sharing  хэширование пароля
shopSchema.pre<IShop>("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
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
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN as string,
    {  expiresIn: "3d" });
  };

  shopSchema.methods.ShopRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN as string,
    { expiresIn: "6d" });
  };


// comapre password
shopSchema.methods.comparePassword = async function (
    enteredPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  const shopModel: Model<IShop> = mongoose.model("Shop", shopSchema);

//module.exports = mongoose.model("Shop", shopSchema);
export default shopModel;