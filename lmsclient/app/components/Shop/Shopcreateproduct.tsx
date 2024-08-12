import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useMeSellerQuery } from "@/redux/features/shop/shopApi";
import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
//   import { createProduct } from "../../redux/actions/product";
// import { categoriesData } from "../../static/data"; //данные
 //  import { toast } from "react-toastify";  //3] 02-08-11
 import  {categoriesData }  from "@/datastatic/data"; //данные
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { IProduct } from "@/redux/features/product/types";
import toast from "react-hot-toast";


const Shopcreateproduct = () => {

// Объявление состояния с типом File[]
   const [images, setImages] = useState<File[]>([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); //описание
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");//текстовый набор тэги
    const [originalPrice, setOriginalPrice] = useState();//начальная цена
    const [discountPrice, setDiscountPrice] = useState(); //цена соскидкой
    const [stock, setStock] = useState(); //запас

    const {data:userData ,isLoading:isLoadinguser, error, refetch} = useLoadUserQuery(undefined, {}); 
    const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery({}); 

//-----------проверка формы на изменения-----------------------------------------
const [isFormValid, setIsFormValid] = useState(false);

// Исходные значения полей
const initialFormState = {
  name: "",
  description: "",
  category: "Choose a category",
  tags: "",
  originalPrice: "",
  discountPrice: "",
  stock: "",
  images: [],
};
  // Проверяем, были ли изменения в форме
  useEffect(() => {
    const isChanged =
    name.trim() !== initialFormState.name.trim() ||
      description.trim() !== initialFormState.description.trim() ||
      category !== initialFormState.category ||
      tags.trim() !== initialFormState.tags.trim() ||
      originalPrice !== initialFormState.originalPrice ||
      discountPrice !== initialFormState.discountPrice ||
      stock !== initialFormState.stock ||
      images.length !== 0;

    setIsFormValid(isChanged);
  }, [name, description, category, tags, originalPrice, discountPrice, stock, images]);
  console.log( '------форма---------**********валидность isFormValid=', isFormValid) 
//и внизу добавили  disabled={!isFormValid} // Блокируем кнопку, если форма не валидна
//--------------------------------------------------
   //начальное состояния (переменные)  
   const [open, setOpen] = useState(false);
   //если 99999- только логин без   Sign up
   const [activeItem, setActiveItem] = useState(0); //по меню от нуля
   //начальное значение чтоб войти в систему
   const [route, setRoute] = useState("Login");
   

   const [createproduct, 
    { data:datacreateproduct, isLoading:isLoadingproduct, isSuccess:isSuccessproduct , error:errorproduct }] = useCreateProductMutation();
 
    useEffect( () => {
  
      if (!isLoadingproduct) {

        if (isSuccessproduct ) {
          console.log( '---------Создан продукт-----------***********  результат isSuccess') 
          toast.success("Product created Successfully!");
        // navigate(/dashboard)
          window.location.reload()
        }


        if  (errorproduct) { 
          //  console.log( '***********  результат ошибка') 
            console.log('ошибка создания продукта=', errorproduct); 
         
            toast.error( "Ошибка создания продукта "+ errorproduct    ) 
           }


      }


      }, [ datacreateproduct, isLoadingproduct, isSuccessproduct , errorproduct   ]);     

 useEffect( () => {
  
   if (!isLoading && !isLoadinguser) { //загрузка окончена
console.log( ' =   useEffect  sellerData=', sellerData ) 
      if (!sellerData)  { 
          setRoute("Shop-login")
               setOpen(true)
       }
   
   if (sellererror ) {
      console.log( '=======ОШИБКА =', sellererror  )   
    
    if (userData?.user?.shopseller) { //если есть магазин
      setRoute("Shop-login")
      setOpen(true)
    } 
    else {
      setRoute("Shop-Sign-Up")
      setOpen(true)
    }
   }
   
   }

}, [sellerData, userData, isLoading, isLoadinguser, sellererror, error ]);


// создание записи продукта
const handleSubmit = (e:any) => {
    e.preventDefault();

    const newForm:any = new FormData();
      
    images.forEach((image) => {
        newForm.append("images", image)  
//// "images" должно совпадать с тем, что указано  в
// роутере сервера  upload.array("images")        
        });
  
      newForm.append("name", name);
      newForm.append("description", description);
      newForm.append("category", category);
      newForm.append("tags", tags);
    //Если originalPrice может быть undefined, можно преобразовать 
    //его в строку с использованием значения по умолчанию
      newForm.append("originalPrice", (originalPrice ?? 0).toString() );
      newForm.append("discountPrice", (discountPrice ?? 0).toString());
      newForm.append("stock", (stock ?? 0).toString());
      newForm.append("shopId", sellerData.seller._id);

     // console.log( '***********тьак создаем==', newForm) 

 // Используем цикл для вывода содержимого FormData
 for (const [key, value] of newForm.entries()) {
    console.log('***********тьак создаем==', key, value);
}

     createproduct( newForm )// вызываем  useUpdateAvatarMutation


}


//Загрузка фото
const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
    let files = Array.from(e.target.files)
   //Добавляем новые изображения к уже существующим
setImages((prevImages) =>[...prevImages, ...files ])

    // const files = Array.from(e.target.files);
    // setImages([]);
    //    files.forEach((file) => {
    //      const reader = new FileReader();
    //  reader.onload = () => {
    //     if (reader.readyState === 2) {
    //       setImages((old) => [...old, reader.result]);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // });
    }
  };

  // Функция для удаления изображения
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };




    return (
        <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
          <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
          {/* create product form */}
         
          <form onSubmit={handleSubmit}>
        <br />
        <div>
        {/* в /src/pages/ProductDetailsPage
   //!! заменяет все тире пробелом( а если в слове изначально тире было)
const productName = name.replace(/-/g," ") */}
          <label  htmlFor="name" className="pb-2">
            Name [пока тире нельзя ставить]<span className="text-red-500">*</span>
          </label>
          <input
          id="name"
            type="text"
            name="name"
            required
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label   htmlFor="description" className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
          id="description"
            cols={30}
            required
            rows={8}
           // type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label  htmlFor="category" className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
          id="category"
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i:any) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <label  htmlFor="tags" className="pb-2">Tags</label>
          <input
          id="tags"
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label  htmlFor="originalPrice" className="pb-2">Original Price</label>
          <input
          id="originalPrice"
            type="number"
            name="originalPrice"
            required
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e:any) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label htmlFor="discountPrice" className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
          id="discountPrice"
            type="number"
            name="discountPrice"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e:any) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label htmlFor= "stock" className="pb-2">
            Product Stock  Товар на складе<span className="text-red-500">*</span>
          </label>
          <input
          id="stock"
            type="number"
            name="stock"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e:any) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
         
           name="upload"
            id="upload"
            className="hidden"
            multiple
            accept="image/*" // Ограничиваем выбор только изображениями    
          onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
     {images &&
              images.map((image, index) => ( 
                <div key={index} className="relative m-2">     
             <img
                src={URL.createObjectURL(image)}
                alt=""
                className="h-[120px] w-[120px] object-cover"
              />
    <AiOutlineCloseCircle
                size={20}
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => handleRemoveImage(index)}
              />
            </div>


              ))}
          </div>
          <br />
          <div>
    <input    type="submit"   value="Create"
          className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 
                     h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 
                     focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      disabled = {!isFormValid} // Блокируем кнопку, если форма не валидна       
           />
          </div>
        </div>
      </form>
         
         
         
          </div>
);
};

export default Shopcreateproduct;