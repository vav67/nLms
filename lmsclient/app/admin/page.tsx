"use client";

import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
 import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
 import AdminProtected from "../hooks/adminProtected";
 import DashboardHero from "../components/Admin/DashboardHero";
 
 

type Props = {};
//основная страница админа - и как точка для перехода admin/

const page: FC<Props> = (props) => {
  return (
    <div>
    <AdminProtected>  
        <Heading   // заголовок 04-25-12 , не нуждаемся здесь в SEO
          title="ELearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Prograaming, MERN, Redux, Machine Learning"
        />
        <div className="flex h-[200vh]">
       <div className="1500px:w-[16%] w-1/5">
        {/* административная часть */}
            <AdminSidebar />
          </div>  
         <div className="w-[85%]">
          {/* панель управления */}
          <DashboardHero isDashboard={true} />
          
          </div>  
        </div>
      </AdminProtected>  
    </div>
  );
};
export default page;
