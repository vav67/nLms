//страница ( ) магазина с компонентами заголовком и боковой панелью 

"use client";

import React, { useEffect, useState } from 'react'
                                               import Link from "next/link";
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
//import { useMeSellerQuery } from '@/redux/features/shop/shopApi';

import CustomModal from '../utils/CustomModal';
import ShopLogin from '../components/Shop/ShopLogin';
import ShopCreate from '../components/Shop/ShopCreate';
import ShopVerification from '../components/Shop/ShopVerification';
import Loader from '../components/Loader/Loader';

import DashboardHeaderShop from '../components/Shop/Layout/DashboardHeaderShop';
//import DashboardSideBarShop from '../components/Shop/Layout/DashboardSideBarShop';
import DashboardSideBarShop from '../components/Shop/Layout/DashboardSideBarShop';


import { useMeSellerQuery } from '@/redux/features/shop/shopApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';

//import { useMeSellerQuery } from '@/redux/features/api/apiSlice';


const Page = () => {
    const router = useRouter();

   

    const {data:userData ,isLoading:isLoadinguser, error, refetch} = useLoadUserQuery(undefined, {}); 
    const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery({}); 

   //начальное состояния (переменные)  
   const [open, setOpen] = useState(false);
   //если 99999- только логин без   Sign up
   const [activeItem, setActiveItem] = useState(0); //по меню от нуля
   //начальное значение чтоб войти в систему
   const [route, setRoute] = useState("Login");
   
   
 


 useEffect( () => {
  
   if (!isLoading && !isLoadinguser) { //загрузка окончена
console.log( ' =   useEffect  sellerData=', sellerData ) 
      if (!sellerData)  { 
          setRoute("Shop-login")
               setOpen(true)
       }
   
   if (sellererror ) {
      console.log( '=======ОШИБКА =', sellererror  )   
    
    if (userData?.user?.shopseller) { //если есть магазин
      setRoute("Shop-login")
      setOpen(true)
    } 
    else {
      setRoute("Shop-Sign-Up")
      setOpen(true)
    }
   }
   
   }

}, [sellerData, userData, isLoading, isLoadinguser, sellererror, error ]);


 
   
 

//console.log( '======userData =', userData?.user  )   

  return (
   <> {( isLoading || isLoadinguser) ? (
   <Loader /> ) :(  
    <>
   
    <div className="w-full flex " >
    <Link href={`/shop/${sellerData?.seller?._id}` }  className="w-full  ">
  
  первый     page==МАГАЗИН (по айди)=====DASHBOARD=    sellerData= {sellerData?.seller?.name}   =============
       </Link>
    <Link href={"/pageproba" }  className="w-full  ">
   pproba (проба перехода по страницам ) {sellerData?.seller?.name}  {userData?.user?.name} 
        </Link>
       <div className="  h-[35px]     text-[32px] text-black dark:text-white' "> 
       ss
     </div>   
    </div>
   

<div>   
{sellerData && (
                            <>
         <DashboardHeaderShop   seller={ sellerData.seller }  /> {/*  заголовок */}
         <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
   <DashboardSideBarShop active={1} seller={sellerData.seller}
        />   {/*     *боковая панель */}
            </div>
         {/* <DashboardHero />  */}
          </div>
          </>
                        )}     

    </div>



{route === "Shop-Sign-Up" && open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopCreate}
           //  refetch={refetch}
            />
          )}  

{route === "Shop-verification" && open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopVerification}
           //  refetch={refetch}
            />
          )}  
<>
{route === "Shop-login" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopLogin}
           //  refetch={refetch}
            />
          )}  
          </>
        )}

</>



    </>



)}

</>
  )


}

export default Page