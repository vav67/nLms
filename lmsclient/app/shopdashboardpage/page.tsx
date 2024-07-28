"use client";

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation";
import { useMeSellerQuery } from '@/redux/features/shop/shopApi';
import CustomModal from '../utils/CustomModal';
import ShopLogin from '../components/Shop/ShopLogin';
import ShopCreate from '../components/Shop/ShopCreate';
import ShopVerification from '../components/Shop/ShopVerification';
import Loader from '../components/Loader/Loader';
import DashboardHeader from '../components/Admin/DashboardHeader';
import DashboardHeaderShop from '../components/Shop/Layout/DashboardHeaderShop';
import DashboardSideBarShop from '../components/Shop/Layout/DashboardSideBarShop';

const page = () => {
    const router = useRouter();

    const { user } = useSelector((state: any) => state.auth);
       const { seller } = useSelector((state:any) => state.shop )

       
 const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery(undefined, {}); 

   //начальное состояния (переменные)  
   const [open, setOpen] = useState(false);
   //если 99999- только логин без   Sign up
   const [activeItem, setActiveItem] = useState( "99999"); //по меню от нуля
   //начальное значение чтоб войти в систему
   const [route, setRoute] = useState("Login");
   
   
  //  console.log( ' **------у юзера------ shopseller =', user.shopseller   ) 
  //  console.log( ' **------у магазина ------ seller =', seller   ) 


 useEffect( () => {
   console.log( ' =   useEffect  ' ) 
   if (!isLoading) { //загрузка окончена

      if (sellerData) {    }
      else { 
          setRoute("Shop-login")
               setOpen(true)
       }
   
   if (sellererror ) {
      console.log( '=======ОШИБКА =', sellererror  )   
    
    if (user.shopseller) {
      setRoute("Shop-login")
      setOpen(true)
    } 
    else {
      setRoute("Shop-Sign-Up")
      setOpen(true)
    }
   }
   
   }

}, [sellerData, isLoading,  sellererror ]);


 
   
 



  return (
   <> {isLoading ? <Loader /> :  
    <>
   
    <div>page=======DASHBOARD===============</div>
 {/* <div>
    { seller.role}
    { seller.name}
 </div> */}

<div>     
         <DashboardHeaderShop />   {/*заголовок */}
         <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
             <DashboardSideBarShop active={1} /> {/*  *боковая панель */}
            </div>
         {/* <DashboardHero />  */}
          </div> 
    </div>


 <>
{route === "Shop-Sign-Up" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopCreate}
           //  refetch={refetch}
            />
          )}  
          </>
        )}

</>

<>
{route === "Shop-verification" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopVerification}
           //  refetch={refetch}
            />
          )}  
          </>
        )}

</>
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



}

</>
  )
}

export default page