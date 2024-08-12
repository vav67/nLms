//начальная страница
"use client";
import React, { FC, useEffect, useState } from "react";

import Heading from "./utils/Heading";
 import Header from "./components/Header";
 import Hero from "./components/Route/Hero";
 import Courses from "./components/Route/Courses";
   import Reviews from "./components/Route/Reviews";
  import FAQ from "./components/FAQ/FAQ";
   import Footer from "./components/Footer";

   import toast from "react-hot-toast";

import PProba from "./components/PProba";

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import Loader from "./components/Loader/Loader";

interface Props {}

const Page: FC<Props> = (props) => {
  
  const[ profilepage, setProfilepage] = useState(false) //это не профайл пэйдж
  const [pagedatauser, setPagedatauser] = useState(null);
   
  console.log( ' =====page ===== =' );
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  //начальное значение чтоб войти в систему
  const [route, setRoute] = useState("Login");
  
 
 const {data:userData , isLoading, refetch} = useLoadUserQuery(undefined, {});
 
 
  const { data } = useSession(); //получаем данные ссессии(Google на GitHub )
 
  const [  socialAuth, { isSuccess, error , data:socdata, isLoading:issocload }] = useSocialAuthMutation();
 
  const [logout, setLogout] = useState(false);

  const {} = useLogOutQuery(undefined, {  skip: !logout ? true : false,  });
 
  useEffect( () => {
  console.log( ' =============page useEffect  ' ) 
  
  if (!isLoading) { //загрузка окончена
    console.log( 'page=====загрузка окончена =======  ' );

       if (!userData) { //если нет входа просто пользователя
      if (data) { // есть вход из соц груп ( гугл, ....  )
 
        socialAuth({   //передаем данные для запроса в бд из соц группы
         email: data?.user?.email,
        name: data?.user?.name,
       avatar: data?.user?.image,
        });
              refetch(); //повторяем загрузку пользователей
          }
      }
   if (userData ) {  setPagedatauser(userData.user)      }

      if(data === null) {  
           if(isSuccess) { 
          
            toast.success("Login Successfully");  }
           
          }
     
     ////// ??  if(data === null && !isLoading && !userData){  setLogout(true);   }
 
  } else  {

if (!issocload )  {  if (socdata) {    setPagedatauser(socdata.user)  }   }
         }

         
}, [data, userData, isLoading, issocload , socdata, isSuccess ]);

  
 




  return (
<>
     {
     isLoading ? (  <Loader /> ) : (  

    <div>
      <Heading
        title="ELearning-oK"
        description=" Ini adaldjf sd odf s ofj sdf pfosjdfsj sdf s"
        keywords="Makan, Enak, Jangan, Makan, Tidur"
      />
  
     
  
 
  
          <Header
          //передаем начальное состояние
                     open={open}
                  setOpen={setOpen}
                  activeItem={activeItem}
                 setRoute={setRoute}
                   route={route}
                
                   profilepage = {profilepage}
                      userData ={pagedatauser}
                      refetch={refetch}
                />  
    
          <Hero />       
        <Courses /> 
         <Reviews />  
      <FAQ />     
                    
              <Footer />   
    </div>
  )}
  </>
  );
};

export default Page;