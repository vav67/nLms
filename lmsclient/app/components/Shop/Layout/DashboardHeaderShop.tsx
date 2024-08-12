"use client";
// заголовок магазина
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
import Link from "next/link";
import avatarIcon from "../../../../public/next.svg";

import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
 
 
import { BiMessageSquareDetail } from "react-icons/bi";
import { ThemeSwitcher } from '@/app/utils/ThemeSwitcher';
//import { backend_url } from "../../../server";
 


const DashboardHeaderShop = ({seller }:any ) => {
  if (!seller) return null; // Компонент проверяет наличие данных и не рендерится без них
  //  const { user } = useSelector((state: any) => state.auth);
     //  const { seller } = useSelector((state:any) => state.shop )

     console.log( 'DashboardHeaderShop  === ', seller)  

return (
  <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 
                 z-30 flex items-center justify-between px-4">
    <div>    
      <Link href={"/"}>
<img src="https://shopo.quomodothemes.website/assets/images/logo.svg"
         alt="" />
      </Link>
    </div>
    <div className="flex items-center">
      <div className="flex items-center mr-4">
   
   <Link href={"/dashboard/cupouns"} //className="800px:block hidden"
   >
<AiOutlineGift color="#555" title={"Enrolled Courses"} size={30}  className="mx-5 cursor-pointer" />
          </Link>
  
   <Link href={"/dashboard-events"} className="800px:block hidden">
<MdOutlineLocalOffer color="#555" title={"Enrolled Courses"} size={30} className="mx-5 cursor-pointer" />

          </Link>
   
    <Link href={"/dashboard-products"} // className="800px:block hidden"
    >
<FiShoppingBag color="#555"  title={"Enrolled Courses"} size={30} className="mx-5 cursor-pointer" />
          </Link>
  
      <Link href={"/dashboard-orders"} // className="800px:block hidden"
      >
<FiPackage color="#555" size={30} title={"Enrolled Courses"} className="mx-5 cursor-pointer" />
        </Link>
      
       <Link href={"/dashboard-messages"} //className="800px:block hidden"
       >
<BiMessageSquareDetail color="#555" size={30} title={"Enrolled Courses"} className="mx-5 cursor-pointer" />
        </Link>

  <Link href={`/shop/shophomepage`}>
          <img  src= {seller.avatar?.url ? seller.avatar?.url : avatarIcon }
        
   alt=""       className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </Link>   
            <div  className={` text-black dark:text-white`} //сам добавил из за зависания
            ><ThemeSwitcher   /></div> 
      </div>
    </div>
  </div>
  )
}

export default DashboardHeaderShop