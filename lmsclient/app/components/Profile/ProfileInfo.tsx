import Image from "next/image";
 import toast from "react-hot-toast";
import { styles } from "../../../app/styles/style";
import React, { FC, useEffect, useState } from "react";
  import { AiOutlineCamera } from "react-icons/ai";
 import avatarIcon from "../../../public/next.svg";
  import {
     useEditProfileMutation,
    useUpdateAvatarMutation,
   } from "@/redux/features/user/userApi";
// import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  avatar: string | null;
  user: any;
  theme: any
};
const ProfileInfo: FC<Props> = ({ avatar, user, theme }) => {
  
   const [name, setName] = useState(user && user.name);
 

   //вызов для изменения аватара
   const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();


//вызываем для изменения профиля
 const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
      
 const [loadUser, setLoadUser] = useState(false);

  console.log( ' ===  setLoadUser ==== loadUser=', loadUser)  

 const {} = useLoadUserQuery(undefined, { skip:loadUser ? false : true });

  

// Изменяем аватар
   const imageHandler = async (e: any) => {
    
    const fileReader = new FileReader();

    fileReader.onload = () => {
    // console.log( ' ===загружаем')
      if (fileReader.readyState === 2) {
       //не правильно const avatar = fileReader.result;
     //   console.log( ' ===вызываем') 
       //не правильно  updateAvatar({ avatar, }); 
       updateAvatar( fileReader.result )// вызываем  useUpdateAvatarMutation
 //     updateAvatar(avatar);
      }
    };

   // console.log( ' ===прошли') 
    fileReader.readAsDataURL(e.target.files[0]);
   };




  useEffect(() => {
    console.log( '*********** проверим результат isSuccess=', isSuccess) 
// проверим результат
    // if (isSuccess || success) {  
    // //  console.log( '***********  результат isSuccess') 
    //   setLoadUser(true);
    //     }
    if (isSuccess) {
   //   console.log( '***********  результат isSuccess') 
      setLoadUser(true);
      console.log( '***********  результат isSuccess == loadUser=', loadUser) 
    }

   if  (error || updateError) { 
  //  console.log( '***********  результат ошибка') 
    console.log(error);   }
    
    if (success) {
     toast.success("Profile updated successfully");
    setLoadUser(true);
    }

  }, [isSuccess, error, success, updateError]);

   
  //редактируем профиль
    const handleSubmit = async (e: any) => {
     e.preventDefault();
    if (name !== "") {  await editProfile({ name: name,   });  }
   };
 
 

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
        <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px]  
             border-[#37a39a] rounded-full   dark:bg-slate-200 bg-slate-100 "
            
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg,image/webp"
          />  
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] dark:bg-slate-500 bg-slate-100 rounded-full absolute
             bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} 
      className={` ${theme === 'dark' ? "fill-[#f8f8f8]" : "fill-[#080808]"  } ` }
              />
            </div>
          </label>  
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        
         <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className={`${styles.label} block pb-2 `}>Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className={`${styles.label} block pb-2 `} >Email Address</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0 dark:bg-slate-500 bg-slate-100`}
                required
                value={user?.email}
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] 
              text-center dark:text-[#fff] Otext-black rounded-[3px] 
              mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>  
        <br />
    
      </div>
    </>
  );
};
export default ProfileInfo;
