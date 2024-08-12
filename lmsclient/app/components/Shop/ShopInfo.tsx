"use client";

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import shopstyles from '@/app/styles/shopstyles';
import Link from "next/link";
import avatarIcon from "../../../public/next.svg";

const ShopInfo = ({isOwner, seller}:any) => {
  // const { seller } = useSelector((state:any) => state.shop )
  // const { user } = useSelector((state: any) => state.auth);
  


//выход из системы 3] 02-57-06
const logoutHandler = async () => {
//   axios.get(`${server}/shop/logout`,{
//   withCredentials: true,
// });
// window.location.reload();
};

 
  
return (
    <>
        {
     !seller  ? (
       <Loader />
     ) : (         <div>
        <div className="w-full py-5">
          <h4>---- информ Shop------------</h4>
         <div className="w-full flex item-center justify-center">
          <img  // src={`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URI}${seller.avatar}`}   
            src={ seller.avatar?.url ?  seller.avatar?.url : avatarIcon }
           // src={avatar ? avatar : avatarIcon}
     alt="" className="w-[150px] h-[150px] object-cover rounded-full" />
         </div>  
         <h3 className="text-center py-2 text-[20px]">{seller.name}</h3>
         <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
           {seller.description}
         </p>
       </div>  
       <div className="p-3">
         <h5 className="font-[600]">Address</h5>
         <h4 className="text-[#000000a6]">{seller.address}</h4>
       </div>
       <div className="p-3">
         <h5 className="font-[600]">Phone Number</h5>
         <h4 className="text-[#000000a6]">{seller.phoneNumber}</h4>
       </div>
     <div className="p-3">
         <h5 className="font-[600]">Total Products</h5>
         <h4 className="text-[#000000a6]">
           {/* {  products && products.length }  */}
          пока десять
          </h4>
       </div> 
       <div className="p-3">
         <h5 className="font-[600]">Shop Ratings</h5>
         <h4 className="text-[#000000b0]">        
              {/* {averageRating}/5  добав комп-т рейтинг */}
            4/5
         </h4>
       </div>  
         <div className="p-3">
         <h5 className="font-[600]">Joined On</h5>
         <h4 className="text-[#000000b0]">
             {seller?.createdAt?.slice(0, 10)}
          </h4>
       </div>    
     {isOwner && (
         <div className="py-3 px-4">
            <Link href={"/settings"}>
            <div className={`${shopstyles.button} !w-full !h-[42px] !rounded-[5px]`}>
             <span className="text-white">Edit Shop</span>
           </div>
            </Link>
           <div className={`${shopstyles.button} !w-full !h-[42px] !rounded-[5px]`}
             onClick={logoutHandler}
           >
             <span className="text-white">Log Out</span>
           </div>
         </div>
       )}  
     </div>
      )
    }  
    </>
   );
}

export default ShopInfo