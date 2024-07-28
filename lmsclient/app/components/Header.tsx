"use client";
 import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
  import NavItems from "../utils/NavItems";
 
  import { HiOutlineMenuAlt3  } from "react-icons/hi";
    import {   HiOutlineUserCircle,  HiUser } from "react-icons/hi"

   import CustomModal from "../utils/CustomModal";
 import Login from "./Auth/Login";  //вход
 import Signup from "./Auth/SignUp"; // регистрация
  import Verification from "./Auth/Verification";
  
  import { useSelector } from "react-redux";

  import Image from "next/image";
  import avatar from "../../public/next.svg";
  import { useSession } from "next-auth/react";
  import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
 import toast from "react-hot-toast";
  import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
  import Loader from "./Loader/Loader";
 import { ThemeSwitcher } from "../utils/ThemeSwitcher"; //переключатель тем


  type Props = {
  open: boolean;  //наш набор открыт
  setOpen: (open: boolean) => void;
  activeItem: number; //активный
   route: string;
    setRoute: (route: string) => void;
  };

//========================

  
 const Header: FC<Props> = ({  activeItem, setOpen, open , route, setRoute  }) => {
  
  const { user } = useSelector((state: any) => state.auth  )

  console.log( '****** Header *useSelector*     user=', user)

   const [active, setActive] = useState(false);
   const [openSidebar, setOpenSidebar] = useState(false);
 
 //вызов api запрос  
 //undefined или если вы хотите предпринять дополнительные действия (например, отправить запрос на сервер) 
 // const {} = useLoadUserQuery(undefined, { skip: !logout ? true : false, });
 
  const {data:userData, isLoading, refetch} = useLoadUserQuery(undefined, {});
  
 // console.log( '****** Header **  запрос юзера    userData=', userData)

  const { data } = useSession(); //получаем данные ссессии(Google на GitHub )
  
 //console.log( '**** Header ** сессия gogleвход data=', data)


   //получаем ответ от запроса социльной авториз-ции в таком виде
   //  console.log( '---sendToken отправим-true  accessToken=',accessToken, 
   // '  user= ', user)
   const [  socialAuth, { isSuccess, error  }] = useSocialAuthMutation();

   const [logout, setLogout] = useState(false);
   //вызов api запрос на выход пользователя 
     //если вы хотите предпринять дополнительные действия (например, отправить запрос на сервер) перед
     // выходом пользователя из системы. Это может быть полезно, например, для очистки данных на стороне 
     //сервера перед завершением сеанса пользователя.
   const {} = useLogOutQuery(undefined, {skip: !logout ? true : false,   });
 
 
  useEffect( () => {
  console.log( ' ================== Header  useEffect  ' ) 

  
  if (!isLoading) { //загрузка окончена
 // console.log( '!!!!!!!!!! Header  useEffect приходит дата от запроса data=', data ,  ' или user=', userData) 
   
 if (!user)
{
      if (!userData) { //если нет входа просто пользователя
      if (data) { // есть вход из соц груп ( гугл, ....  )
       console.log( '!!!!!!!!!! Header  useEffect приходит дата от запроса data=', data ) 

       socialAuth({   //передаем данные для запроса в бд из соц группы
         email: data?.user?.email,
        name: data?.user?.name,
       avatar: data?.user?.image,
        });
      // refetch(); //повторяем загрузку пользователей
          }
      }
    }
 
 
  }
 
}, [data, userData, isLoading]);

 


  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  // клик  mobile sidebar
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
       { setOpenSidebar(false) }
    }
  };

  console.log( 'Header===================== user=', user);
  // console.log(data);
  //========================
 
  return (
    <>
    {
     isLoading ? (
       <Loader />
     ) : (
       <div className="w-full relative">
       <div
         className={`${
           active
             ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
             : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
         }`}
       >
         <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
           <div className="w-full h-[80px] flex items-center justify-between p-3">
             <div>
               <Link
                 href={"/"}
                 className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
               >
                 ELearning
               </Link>
             </div>

             <div>
            <Link
                href={"/pageproba"}
                // https://tailwindcss.com/docs/text-color о цветах
                className={`text-[25px] font-Poppins font-[500] text-orange-200 dark:text-white`}
            >
               жми  pageproba
               </Link>
             </div>

             <div className="flex items-center">
               <NavItems activeItem={activeItem} isMobile={false} />
           
           
            
            <div  className={` text-black dark:text-white`} //сам добавил из за зависания
            ><ThemeSwitcher   /></div>  
               
               
           
   
        {/* only for moblile  иконка меню */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer  dark:text-white   text-black"
            //отображ боковая панель меню мобил      
                  onClick={() =>  setOpenSidebar(true)}
                />
              </div>
 
              {user ? (
                <Link href={"/profile"}>
                  
                  <Image
                    src={ user.avatar ?  user.avatar.url : avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer 
                        dark:bg-slate-200 bg-slate-100 "
                    style={{border: activeItem === 5 ? "2px solid #37a39a  " : "none"}}
                  />
                  <div className="hidden 800px:block cursor-pointer  dark:text-white  text-black "
                  >
                   { user?.name}</div>
                  
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}   // Иконка нашего профиля
                  className="hidden 800px:block cursor-pointer  dark:text-white  text-black "
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
      </div>
      </div>
              {/* mobile sidebar -  боковая панель меню мобил   */}
 {openSidebar && (
          <div //кликаем слева от боковой панели и она закроется
          className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
          onClick={handleClose}
          id="screen"
        >
          <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
            <NavItems activeItem={activeItem} isMobile={true} />
            { user ? (
              <Link href={"/profile"}>
                <Image
                  src={ user?.avatar ?  user.avatar.url : avatar}
                  alt=""
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full ml-[20px] cursor-pointer"
                  style={{border: activeItem === 5 ? "2px solid #37a39a" : "none"}}
                />
              </Link>
            ) : (
              <HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
            )}
            <br />
            <br />
            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
              Copyright © 2023 ELearning
            </p>
          </div>
        </div>
      )}
    </div>
      {
             route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
             refetch={refetch}
            />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
        {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Signup}
            />
          )}  
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
      </div>
     )}
    </>
   );
 };

export default Header 