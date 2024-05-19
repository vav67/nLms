"use client";

import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import React, { useEffect, useState } from 'react'

const PProba = () => {

    const [ii, setIi] = useState( 'итак');
   const {data:userData, isLoading, refetch} = useLoadUserQuery(undefined, {});

    useEffect( () => {
        setIi( 'эфект')
           if (!isLoading) { //загрузка окончена
            setIi( 'загрузилось')
           if (!userData) {  setIi( 'НЕТУ userData') 
           
           }
           if (userData) {  setIi( 'есть userData')   }

        
       }
     }, [ userData, isLoading]);

  return (
    <div className=' text-center font-Poppins text-[45px] dark:text-white'
    >PProba === {ii}</div>
  )
}

export default PProba