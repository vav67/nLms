"use client";
import { toast } from "react-hot-toast" 
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { styles } from "@/app/styles/style";
import shopstyles from "@/app/styles/shopstyles";
//import styles from "./../styles/styles";
import { useRouter } from "next/navigation";

import { useLoginshopMutation, useRegistershopMutation } from "@/redux/features/shop/shopApi";


type Props = {

  open: boolean;
  setOpen: (open: boolean) => void;
 setRoute: (route: string) => void;
 activeItem: any;
 refetch?:any;
};

//const Profile: FC<Props> = ({ user }) => {
const ShopLogin: FC = ({ open, setOpen, setRoute,   activeItem, refetch }:any) => {
   
    
 ////const { activationTokenShop,  message } = useSelector((state: any) => state.shop); 
//   const navigate = useNavigate();//перемещение по страницам
const router = useRouter();
//   //состояния (переменные)   
 const [email, setEmail] = useState("");
 const [name, setName] = useState("");
 const [phoneNumber, setPhoneNumber] = useState<any>();
 const [address, setAddress] = useState("");
 const [zipCode, setZipCode] = useState<any>();//почтовый индекс
 const [avatar, setAvatar] = useState<any>(null);
 const [password, setPassword] = useState("");
 const [visible, setVisible] = useState(false);

 //получаем ответ от запроса
 const [inlogin, { data, error, isSuccess }] =  useLoginshopMutation();



// //   const qqqhandleSubmit = async (e) => { //отправка при нажатии
// //     e.preventDefault();
// //  await axios.post(`${server}/shop/create-shop`, {
// //             name,
// //             email,
// //             password,
// //             avatar,
// //             zipCode,
// //             address,
// //             phoneNumber,  
// //            },
// //     //    { withCredentials: true }
// //       )
// //       .then((res) => {
// //         toast.success("Login Success!");
// //         navigate("/");//перемещение на основную страницу
// //             window.location.reload(true);  // перезагрузка
// //       })
// //       .catch((err) => {
// //        toast.error(  err.response.data.message);
// //         console.log(err)
// //       });
// //   }
// //-----------перенес из components/Signup/Signup.jsx------
 const handleSubmit = async (e:any) => { //отправка при нажатии
 console.log('handleSubmit ' )
//  //не работает const btn = document.getElementById('submit')
//  //не работает btn.style.color = 'red'
  e.preventDefault();


//   const config = {headers:{"Content-Type":"multipart/form-data"}}       
//  const newForm = new FormData()
//   newForm.append("file", avatar)
//  newForm.append("name", name)
//  newForm.append("email", email)
//  newForm.append("password", password)

//  newForm.append("zipCode", zipCode)
//  newForm.append("address", address)
//  newForm.append("phoneNumber", phoneNumber)

 //  console.log('отправка  name=', newForm.name )
 //  console.log('отправка запроса', newForm )
//   //запрос создание магазина
//      axios.post(`${server}/shop/create-shop`,
//          newForm, config) 
   
//    .then((res) => {  // если ответ есть 
//   //   if (res.data.success == true) {
//        //  alert(res.data.message)  //сообщим
//     //   }
//    // console.log('ответ' )
//             toast.success(res.data.message);

//        setName("");
//          setEmail("");
//         setPassword("");
//           setAvatar();

//           setPhoneNumber(); 
//          setAddress("");
//          setZipCode();

//         })
//          .catch((error) => {
//        console.log( 'ош ShopCreate   =',error)
//    //        toast.error("ошибка")//error.response.data.message);
//            toast.error(error.response.data.message);
//          });

await inlogin({  email , password }); //данные отправили в слайс для сохранения store
// изменим await register и поля как при создании
//toast.success("изменим await register и поля как при создании");

 }

// //--------------------
useEffect(() => {
 if (isSuccess) {
setOpen(false)

 refetch()
 //  toast.success(message);
   ////////////////////////////////////////////////   
// логин ок
  toast.success("Login Success!");
// navigate("/dashboard");  панель управления магазином 
// window.location.reload(); 
//////router.push("/shopdashboardpage");


 }


 


   if (error) {  //если ошибка
   
      if ("data" in error) {
        const errorData = error as any; 
        toast.error(errorData.data.message);
  //    console.log( 'это ошибка=', errorData.data.message )
      }
   

    }
  }, [isSuccess, error]);
  

 //добавить файл аватара
 const handleFileInputChange = (e:any) => {
// //пока записываем путь файла (локальный сервер и /uploads)
   const file = e.target.files[0]
   console.log('me=', file )

   setAvatar(file)


// //    const reader = new FileReader();

//     // reader.onload = () => {
//     //   if (reader.readyState === 2) {
//     //     setAvatar(reader.result);
//     //   }
//     // };

//     // reader.readAsDataURL(e.target.files[0]);
   };

 
   

  

 //console.log( activeItem,'-activeItem name=', name, "  email=", email )


 return (
  <div className="min-h-screen bg-gray-50 ">
   {/*  <div className="min-h-screen bg-gray-50 flex flex-col  justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md"> */}
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
     'Login to your shop == ${activeItem}'
      </h2>
    {/* </div> */}
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
     
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
       id ="email"             
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300
                 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
                  focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
id="password"
               type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {visible ? (
                <AiOutlineEye
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>
          <div className={`${shopstyles.noramlFlex} justify-between`}>
            <div className={`${shopstyles.noramlFlex}`}>
              <input
                type="checkbox"
                name="remember-me"
                id="remember-me"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href=".forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
     {/* { activeItem && ( activeItem === '99999') ? ( null ):
         
       (  <div className={`${shopstyles.noramlFlex} w-full`}>
            <h4>Not have any account?</h4>
            <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Sign-Up")} //передает выше в Header и выше в page.tsx
           >
            Sign up
          </span>
          </div>
      )  } */}

        </form>
    
 
    </div>
  </div>

        
    
 );
};

export default ShopLogin;