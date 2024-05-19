import {Schema, model, Document} from 'mongoose';

interface FaqItem extends Document{
  question: string;
  answer:string;
}
interface Category extends Document{
  title: string;
}
interface BannerImage extends Document{
  public_id: string;
  url:string;
}
interface Layout extends Document{
  type: string;
  faq:FaqItem[];
  categories: Category[];
  banner:{
    image: BannerImage[];
    title:string;
    subTitle:string;
  }
}
//ответы
const faqSchema = new Schema<FaqItem>({
  question:{type:String},
  answer:{type:String},
})
//категории
const categorySchema= new Schema<Category>({
  title:{type:String},
})

const bannerImageSchema= new Schema<BannerImage>({
  public_id:{type:String},
  url:{type:String},
})

//наш макет
const layoutSchema= new Schema<Layout>({
  type:{type:String},
  faq:[faqSchema], //будут часто задаваемые вопросы
  categories:[categorySchema],
  banner:{      //баннер
    image: bannerImageSchema,
    title:{type:String}, //заголовок
    subTitle:{type:String} //подзаголовок
  }
})


const LayoutModel= model<Layout>('Layout',layoutSchema) 
export default LayoutModel;
