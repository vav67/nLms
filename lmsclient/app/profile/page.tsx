//защищенная страница профиля юзера
"use client";

import React, { FC, useState } from "react";
 import Protected from "../hooks/useProtected"; //защита
import Heading from "../utils/Heading";
import Header from "../components/Header";
   import Profile from "../components/Profile/Profile";
  import { useSelector } from "react-redux";
//аватар  
  import avatar from "../../public/next.svg";
import Footer from "../components/Footer";
 

type Props = {};

const page: FC<Props> = (props) => {
console.log( 'profile пропсы =', props)

  const { user } = useSelector((state: any) => state.auth);

   //начальное состояния (переменные)  
   const [open, setOpen] = useState(false);
   const [activeItem, setActiveItem] = useState(5); //по меню от нуля
   //начальное значение чтоб войти в систему
   const [route, setRoute] = useState("Login");
   
   
  
  return (
    
    <div className="min-h-screen"> {/* мин высота по эрану, чтоб не было засветов снизу*/}
      < Protected >  
         <Heading
          title={`${user?.name} profile - Elearning`}
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
        />  
  
  <p>страница профиля---------------------------</p>

      {/* <Profile  open={open} setOpen={setOpen} user={user} avatar={avatar} />  */}
      <Profile     /> 

      <Footer />

       </Protected>  
    </div>
  );
};
export default page;
