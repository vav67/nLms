"use client";
import React, { FC, useEffect, useState } from "react";
import ShopCreate from "../components/Shop/ShopCreate";
import shopstyles from "../styles/shopstyles";
import ShopInfo from "../components/Shop/ShopInfo";
import ShopProfileData from "../components/Shop/ShopProfileData";
 
 

const page = () => {


    return (
        <div className={`${shopstyles.section} bg-[#f3f3f0]`}>
             
             <div className="  text-[36px] font-[600] text-[#0c0b0ba6]">
              домашняя страница магазина</div>
              <div className="w-full flex py-10 justify-between ">
     
     <div className="w-[25%] bg-[#fdfcfc] rounded-[4px] shadow-sm
              overflow-y-scroll h-[90vh] sticky top-10 left-0 z-10">
            {/*  <ShopInfo isOwner={true} />      боковая панель инфо магазина*/}
            <ShopInfo   />
              </div> 
               <div className="w-[72%] rounded-[4px]   ">
                {/* <ShopProfileData isOwner={true} />  профиль магазина */}
                <ShopProfileData />   
              </div> 
             </div>   
           
        </div>
      )
    }
export default page