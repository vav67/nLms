import React, { FC, useState } from "react";
import avatarDefault from "../../../public/next.svg"; //аватар
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";
import { useTheme } from "next-themes";

import { HiChartBar } from "react-icons/hi"

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logOutHandler: any;
};

const SideBarProfile: FC<Props> = (
          { user, active, avatar, setActive, logOutHandler,}) => {

 const { theme, setTheme } = useTheme() //сам для темы

  return (
    <div className="w-full">
 
    <div  className={`w-full flex items-center px-3 py-4 cursor-pointer ${
           active === 1 ? "dark:bg-slate-600 bg-slate-200" : "bg-transparent"  }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user.avatar || avatar ? user.avatar.url || avatar : avatarDefault }
          alt=""   width={20}  height={0} 
    title={"podskazka"}
    className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
  style={{  border:  "1px solid #37a39a", backgroundColor:  '  rgba(300, 300, 300, 0.9)' }}
          />  
       <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
              My Account
           </h5> 
          </div> 
 
  <div   className={`w-full flex items-center px-3 py-4 cursor-pointer ${
           active === 2 ? "dark:bg-slate-600 bg-slate-200" : "bg-transparent"  }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20}  
        className={` ${theme === 'dark' ? "fill-[#f8f8f8]" : "fill-[#080808]"  } ` }      
        title={"Change Password"}  />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Change Password
            </h5>
         </div>  


     <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-600 bg-slate-200 " : "bg-transparent" 
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20}  
         className={` ${theme === 'dark' ? "fill-[#f8f8f8]" : "fill-[#080808]"  } ` }      
         title={"Enrolled Courses"}
           />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Courses Зарегистрированные курсы
        </h5>  
 </div> 

    {user.role === "admin" && (
 
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 9 ? "dark:bg-slate-600 bg-slate-200" : "bg-transparent"
          }`}
        href={"/admin"}
        >
          <MdOutlineAdminPanelSettings size={20} 
              className={` ${theme === 'dark' ? "fill-[#f8f8f8]" : "fill-[#080808]"  } ` }      
              title={"Admin Dashboard"}  />
          <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </Link>
       
      )}  

          

       <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 7 ? "dark:bg-slate-600 bg-slate-200" : "bg-transparent"
        }`}
        onClick={() => logOutHandler()}
      >  
        <AiOutlineLogout size={20}
                    className= " dark:text-white  text-black "      
            title={"Logout"}  />
        
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Logout
        </h5> 

      </div>



      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 11 ? "dark:bg-slate-600 bg-slate-200 " : "bg-transparent" 
        }`}
        onClick={() => setActive(11)}
      >
        <HiChartBar size={20}  className= " dark:text-white  text-black "    
      title={"проба"}
           />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white
         text-black">
        проба
        </h5>  
 </div> 







    </div>
  );
};

export default SideBarProfile;
