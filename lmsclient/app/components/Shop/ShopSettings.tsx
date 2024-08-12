"use client";
//настройки об продавце

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import avatarIcon from "../../../public/next.svg";
import Image from "next/image";

import { AiOutlineCamera } from "react-icons/ai";
import shopstyles from '@/app/styles/shopstyles';
import { Tprofil, useEditProfileShopMutation, useMeSellerQuery, useUpdateAvatarShopMutation } from '@/redux/features/shop/shopApi';

import { useTheme } from "next-themes" //сам тема
import Loader from '../Loader/Loader';
import toast from "react-hot-toast";

const ShopSettings = () => {
    //const { seller } = useSelector((state:any) => state.shop )
    const { data: dataseller, isSuccess:sellerSuccess,  isLoading, error:sellererror, refetch } =  useMeSellerQuery({}); 

    const { theme, setTheme } = useTheme() //сам для темы
  
 
 const [name, setName] = useState("");
 const [description, setDescription] = useState( "");
 const [address, setAddress] = useState("");
 const [phoneNumber, setPhoneNumber] = useState( );
 const [zipCode, setZipcode] = useState(  );
  const [avatar, setAvatar] = useState( );
 
//вызываем для изменения профиля
const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileShopMutation();

 //вызов для изменения аватара
 const [updateAvatar, { isSuccess, error }] = useUpdateAvatarShopMutation();
    
 const [loadUser, setLoadUser] = useState(false);

 // console.log( ' ===  setLoadUser ==== loadUser=', loadUser)  

 ///const {} = useLoadUserQuery(undefined, { skip:loadUser ? false : true });

 
 
 
 useEffect(() => {
if ( sellerSuccess  //     !isLoading

  ) {
  
  setName(dataseller.seller.description ?  dataseller.seller.name : "" );
  
setDescription (
    dataseller.seller.description ? dataseller.seller.description : "Enter your shop description"  );

 setAddress(dataseller.seller.description ? dataseller.seller.address : ""  );
 setPhoneNumber(dataseller.seller.description ? dataseller.seller.phoneNumber : 0 );
 setZipcode(dataseller.seller.description ? dataseller.seller.zipCode : 0);
 setAvatar( dataseller.seller.avatar?.url ? dataseller.seller.avatar?.url : avatarIcon)
}
 

 }, [ sellerSuccess ]);



 useEffect(() => {
  console.log( '*********** проверим результат isSuccess=', isSuccess) 
// проверим результат
  // if (isSuccess || success) {  
  // //  console.log( '***********  результат isSuccess') 
  //   setLoadUser(true);
  //     }
  if (isSuccess) {
    console.log( '--------------------***********  результат isSuccess') 
    setLoadUser(true);
    console.log( '******ПРИНУДИТЕЛЬНО ОБНОВИМ***  результат isSuccess == loadUser=', loadUser) 
     refetch() 
  }

 if  (error || updateError) { 
//  console.log( '***********  результат ошибка') 
  console.log(error); 
 refetch() 
  toast.error( "Ошибка "+ error + updateError    ) 
 }
  
  if (success) {
     refetch() 
    toast.success("Profile updated successfully");
  setLoadUser(true);
   
  }
 
}, [isSuccess, error  , success, updateError ]);


   // апгрейд аватара
   const handleImage = async (e:any) => {
    e.preventDefault();
  ////  const formData = new FormData() это если на сервере сохранять файл
  
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
}



   //апгрейд информации об магазине
   const updateHandler = async (e:any) => {
    e.preventDefault();
    const prof:Tprofil = { 
      name, description, address,
      phoneNumber, //поле не обязательно  phoneNumber: phoneNumber || 0,
      zipCode // zipCode: zipCode || 0  //поле не обязательно zipCode,  
      
      }   
    
      await editProfile( prof )
 
  };

  console.log( '*********---------seller=', dataseller) 

 // console.log( '+++-------seller=', dataseller.seller.name ) 
    return (
      <>
      {
        isLoading ? (
         <Loader />
       ) : ( 
        <div className="w-full min-h-screen flex flex-col items-center">
          <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
            <div className="w-full flex items-center justify-center">
             <div className="relative">
                <Image
       
      //src={dataseller.seller.avatar?.url ? dataseller.seller.avatar?.url : avatarIcon }
                     src={avatar ? avatar : avatarIcon}
                       alt=""
                            width={200}
                            height={200}
       className="w-[200px] h-[200px] rounded-full cursor-pointer
       border-[3px]   border-[#37a39a]"
                />
     <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    onChange={handleImage}
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
            </div>
    
            {/* shop info */}
            <form       // aria-aria-required={true}
              className="flex flex-col items-center"
               onSubmit={updateHandler}
            >
               <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">  Shop Name  </label>
                 
                </div>
                <input
                  type="name"
                  placeholder={name}
                  value={name}
                  onChange={(e) => setName(e.target.value)} //сохраним в value
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>  
                <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop description</label>
                </div>
                <input
                  type="name"
                  placeholder={description}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} //сохраним в value
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
                />
              </div>  
               <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Address</label>
                </div>
                <input
                  type="name"
                  placeholder={ address}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} //сохраним в value
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                />
              </div>  
    
                <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Phone Number</label>
                </div>
                <input
                  type="number"
                  placeholder={  phoneNumber  }  
                  value={phoneNumber}
                  onChange={(e:any) => setPhoneNumber(e.target.value)} //сохраним в value
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
               //   required
                />
              </div>  
    
               <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <div className="w-full pl-[3%]">
                  <label className="block pb-2">Shop Zip Code</label>
                </div>
                <input
                  type="number"
                  placeholder={ zipCode}
                  value={zipCode}
                  onChange={(e:any) => setZipcode(e.target.value)}
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
                 // required
                />
              </div>  
    
               <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                <input
                  type="submit"
                  value="Update Shop"
                  className={`${shopstyles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                  readOnly
                />
              </div>  
            </form>
          </div>
          <button onClick = { () => refetch()}> REFETCH - принудит обновим</button>
        </div>

)} 
</>

      );
}

export default ShopSettings