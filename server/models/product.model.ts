import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IShop } from "./shop.model";


interface IReviewproduct extends Document {
    user: IUser;
    rating: number;
    comment: string;
    productId:string;
     
  } 

//интерфейс коментирования
export interface IProduct extends Document {
    name: string;  
    description: string;
    category:  string; 
    tags:  string;   
    originalPrice?: number;
    discountPrice:number;    
    stock:number;
    images: Array< {
        public_id: string;
        url: string;
      }>;
    reviews?: [IReviewproduct];
    ratings?: number;
    shopId:    string;
    shop:  IShop;  
    sold_out?:number; 
  }

  const reviewproductSchema = new Schema<IReviewproduct >({
    user: Object,
    rating: { type: Number,  default: 0,  },
    comment: String,
    productId: String,
  }, {timestamps: true} //добавлено время записи);
  )




  const productSchema = new Schema<IProduct>({
    name: {   type: String,   
        required: [true, "Please enter your product name!"],       },
  description: { type: String, 
        required: [true, "Please enter your product description!"], },
    category: {  type: String, 
        required: [true, "Please enter your product category!"],    },
        tags: {          type: String,  },
        originalPrice: { type: Number,  },
        discountPrice: {  type: Number, required: [true, "Please enter your product price!"],     
            },
        stock: {  type: Number, required: [true, "Please enter your product stock!"], 
              },
        images: [ //{ type: String }, // если локальный 3] 01-41-35
          {
            public_id: { type: String,  //required: true, 
              },
            url: { type: String,        //required: true, 
              },
          },
        ],
      
        reviews: [ //массив отзывов  4] 07-34-34
        reviewproductSchema
      ],
    
      ratings: { type: Number,  }, //рейтинг 4] 07-34-39
    
      shopId:  { type: String,  required: true, },
      shop: {    type: Object,  required: true, },
      sold_out: {type: Number,  default: 0,     },
    
},
{timestamps:true});

const ProductModel: Model<IProduct> = mongoose.model("Product", productSchema);
export default ProductModel;
//и мы можем экспортировать наше значение по умолчанию


