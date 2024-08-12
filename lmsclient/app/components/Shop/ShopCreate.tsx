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
 
import { useRegistershopMutation } from "@/redux/features/shop/shopApi";


type Props = {
  setRoute: (route: string) => void;
  activeItem: any;
};

 
const ShopCreate: FC<Props> = ({ setRoute,  activeItem } ) => {

  const { activationTokenShop,  message } = useSelector((state: any) => state.shop); 
  const { user } = useSelector((state: any) => state.auth); 


//   const navigate = useNavigate();//перемещение по страницам
//   //состояния (переменные)   
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<any>();
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState<any>();//почтовый индекс
  const [avatar, setAvatar] = useState<any>(null);
  const [password, setPassword] = useState("");

  const [visible, setVisible] = useState(false);
  const [scroll, setScroll] = useState(false);
  //получаем ответ от запроса
  const [register, { data, error, isSuccess }] =  useRegistershopMutation();


 
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
  // const newForm = new FormData()
  //  newForm.append("file", avatar)
  // newForm.append("name", name)
  // newForm.append("email", email)
  // newForm.append("password", password)

  // newForm.append("zipCode", zipCode)
  // newForm.append("address", address)
  // newForm.append("phoneNumber", phoneNumber)



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
await register({ name, email, password, address, phoneNumber, 
  zipCode  }); //данные отправили в слайс для сохранения store


  }

// //--------------------
useEffect(() => {
  if (isSuccess) {
    toast.success(message);
    setRoute("Shop-verification");
  }
    if (error) {  //если ошибка
      // console.log( '-----если ошибка=', error ) toast.error( '----если ошибка');
       if ("data" in error) {
         const errorData = error as any; 
         toast.error(errorData.data.message);
       console.log( 'это ошибка=', errorData.data.message )
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


 
   

    if (typeof window != "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 85) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      });
    }



 

  return (
  
    <div className="min-h-screen bg-gray-50  ">
 
<h2 className="  text-center text-3xl font-extrabold text-gray-900  ">
       { user.name }   Register as a seller как продавца 
        
        </h2>
   
<form className="space-y-6 mt-6" onSubmit={handleSubmit }>
            <div className="mb-3">
            
              <label
          
                htmlFor="name"
            className="block text-sm font-medium text-gray-700"
              >
                Shop Name
              </label>
              <div className="mt-1">
                <input
                  type="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />

              </div>
     
            </div>

            <div>
              <label
                
                htmlFor="email"
             className="block text-sm font-medium text-gray-700"
              >
                Email address Enter your Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone-number"
                 className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="phone-number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

 

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="address"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="zipcode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                    src={URL.createObjectURL(avatar)}
                    //  src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : ( //тогда заменим его
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label //загрузка файла аватара
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border
                   border-gray-300 rounded-md shadow-sm text-sm font-medium
                    text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png" //добавлено
               onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
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
 

            {/* <div className={`${shopstyles.noramlFlex} w-full`}>
              <h4>Already have an account?</h4>
              <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign in
          </span>
            </div> */}
          </form>
          </div>
     
  );
};

export default ShopCreate;