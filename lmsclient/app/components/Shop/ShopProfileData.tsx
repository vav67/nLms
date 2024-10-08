"use client";
//создаем информацию о магазине 
 
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { styles } from "@/app/styles/style";



const ShopProfileData = ({isOwner}:any) => {
 
  const [active, setActive] = useState(1);




  return (
 

       <div className="w-full">
   
      <div className="flex w-full items-center justify-between">
       
        <div className="w-full flex">
           <div className="flex items-center" onClick={() => setActive(1)}>
 <h5 className={`font-[600] text-[20px] 
    ${ active === 1 ? "text-red-500" : "text-[#333]"} 
     cursor-pointer pr-[20px]`}>
              Shop Products
            </h5>
          </div>  

           <div className="flex items-center" onClick={() => setActive(2)}>
 <h5  className={`font-[600] text-[20px] 
 
 ${active === 2 ? "text-red-500" : "text-[#333]"} 
       cursor-pointer pr-[20px]`} >
              Running Events события
            </h5>
          </div> 

           <div className="flex items-center" onClick={() => setActive(3)}>
<h5 className={`font-[600] text-[20px] 
 
 ${active === 3 ? "text-red-500" : "text-[#333]" } 
          cursor-pointer pr-[20px]`} >
              Shop Reviews Отзывы
            </h5>
          </div>  
        </div>

       <div>
          {isOwner && (  
            <div>
              <Link href={`/shopdashboardpage`} >
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
            )}
       </div>  

       </div>
  {/* //-------вывод продуктов------   01-05-50  ---------------------          */}


   
  </div>


 

  )
}

export default ShopProfileData