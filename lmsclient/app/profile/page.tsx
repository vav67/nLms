//защищенная страница профиля юзера
"use client";

import React, { FC, useEffect, useState } from "react";
 import Protected from "../hooks/useProtected"; //защита
import Heading from "../utils/Heading";
import Header from "../components/Header";
   import Profile from "../components/Profile/Profile";
  import { useSelector } from "react-redux";
//аватар  
  import avatar from "../../public/next.svg";
import Footer from "../components/Footer";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../components/Loader/Loader";
 

type Props = {};

const page: FC<Props> = (props) => {
//console.log( 'profile пропсы =', props)

 //// const { user } = useSelector((state: any) => state.auth);

 const[ profilepage, setProfilepage] = useState(true) //это   профайл пэйдж

   //начальное состояния (переменные)  
   const [open, setOpen] = useState(false);
   const [activeItem, setActiveItem] = useState(5); //по меню от нуля
   //начальное значение чтоб войти в систему
   const [route, setRoute] = useState("Login");

 const {data:meuser, isLoading  } = useLoadUserQuery(undefined, {});   
   
  
//  useEffect( () => {
 
  
//   if (!isLoading) { //загрузка окончена
//     //console.log( 'page=====загрузка окончена =======  ' );

  
      
//       }

//       }, [  isLoading, meuser  ]);


  return (
    <>
    {
    isLoading ? (  <Loader /> ) : (  

    <div className="min-h-screen"> {/* мин высота по эрану, чтоб не было засветов снизу*/}
      < Protected >  
         <Heading
          title={`${meuser?.user?.name} profile - Elearning`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Prograaming, MERN, Redux, Machine Learning"
        />

          <Header 
          //передаем начальное состояние
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
          userData ={meuser?.user}
          profilepage = {profilepage}
        />  
  
  <p>страница профиля---------------------------</p>

     <Profile  open={open} setOpen={setOpen} user={meuser?.user} //avatar={avatar} 
           />   
     
     
      {/* <Profile     />  */}

      <Footer />

       </Protected>  
    </div>
    )}
    </>
  );
};
export default page;
