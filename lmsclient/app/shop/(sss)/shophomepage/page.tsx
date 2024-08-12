"use client";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
// import ShopCreate from "../../components/Shop/ShopCreate";
// import shopstyles from "../../styles/shopstyles";
// import ShopInfo from "../../components/Shop/ShopInfo";
// import ShopProfileData from "../../components/Shop/ShopProfileData";
import Loader from '@/app/components/Loader/Loader';
import shopstyles from "@/app/styles/shopstyles";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useMeSellerQuery } from "@/redux/features/shop/shopApi";
import ShopInfo from "@/app/components/Shop/ShopInfo";
import ShopProfileData from "@/app/components/Shop/ShopProfileData";
 

const Page = () => {

  //const { seller } = useSelector((state:any) => state.shop )
  const router = useRouter();

  const { data: sellerQueryData, isLoading: isSellerLoading, error: sellerError } = useMeSellerQuery({});
  const { data: userQueryData, isLoading: isUserLoading, refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => {
     
    if (!isSellerLoading && !isUserLoading) {
      if (!userQueryData) {
       // router.replace('/404');
       alert("нет такого  router.push(/)  ")
      }
      if (!sellerQueryData) {
        // router.replace('/404');
        alert("нет такого  router.push(/)  ")
       }
    }
  }, [userQueryData, isSellerLoading, isUserLoading, router]);

  // if (!seller) {  return router.push("/")  }

  return (
    <>
   {
    (isSellerLoading || isUserLoading) ? (
      <Loader />
    ) : ( 
        <div className={`${shopstyles.section} bg-[#f3f3f0]`}>
             
             <div className="  text-[26px] font-[600] text-[#0c0b0ba6]">
              домашняя страница магазина</div>
              <div className="w-full flex  justify-between ">
     
     <div className="w-[25%] bg-[#fdfcfc] rounded-[4px] shadow-sm
              overflow-y-scroll h-[90vh] sticky top-2 left-0 z-10">
              <ShopInfo isOwner={true} seller={sellerQueryData.seller}/>  {/*    боковая панель инфо магазина*/}
         
              </div> 
               <div className="w-[72%] rounded-[4px]   ">
              <ShopProfileData isOwner={true} />   {/*  профиль магазина */}
                
              </div> 
             </div>   
           
        </div>

)
} 
</>
      )
    }
export default Page