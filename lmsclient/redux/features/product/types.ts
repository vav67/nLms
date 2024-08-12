
//import { IPost } from "./model/IPost";
export interface IUser   {
    name: string;
    email: string;
    password: string;
    avatar: {
      public_id: string;
      url: string;
    };
    role: string;
   //--------------------------- 
    addresses:Array<{
        country: string;
        city: string;
        address1: string;
        address2: string;
        zipCode: string;
       addressType: string;
  }>;
  shopseller: boolean;
  //----------------------------------
  
    // было    inVerified: boolean;
  // сам изменил
  isVerified: boolean; // Заменил isVerified на inVerified
  
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;   //токен доступа
    SignRefreshToken: () => string; // токен обновления
  }

export interface IReviewproduct  {
    user: IUser;
    rating: number;
    comment: string;
    productId:string;
     
  } 
  export interface IShop   {
    name: string;
    email: string;
    password: string;
    description:  string;
    address:   string;
    phoneNumber: number ;
    role:  string;  
   // avatar: string; //сам пока откоректировал 
    avatar: {
      public_id: string;
      url: string;
    };
   
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
  }

//интерфейс коментирования
export interface IProduct   {
    name: string;  
    description: string;
    category:  string; 
    tags:  string;   
    originalPrice?: number;
    discountPrice:number;    
    stock:number;
    images: string[];   
    reviews?: [IReviewproduct],
    ratings?: number;
    shopId:    string;
    shop:  IShop;  
    sold_out?:number; 
  }