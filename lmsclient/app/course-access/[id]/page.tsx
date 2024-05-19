 'use client'
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
    params:any;
}

const Page = ({params}: Props) => {
    const id = params.id;
    const { isLoading, error, data, refetch } = useLoadUserQuery(undefined, {});

    useEffect(() => {
    if (data) {//данные есть
  //проверяем действительно есть у пользователя этот курс
      const isPurchased = data.user.courses.find(
         (item: any) => item._id === id
       );
      if (!isPurchased) {  redirect("/");  } // если нет
    }
      if (error) { redirect("/"); }// ошибка
   }, [data,error]);

  return (
   <>
   {
    isLoading ? (
        <Loader />
    ) : (
        <div>
          {/* передаем айди курса и пользователя */}
           <CourseContent id={id}  user={data.user} />    
        </div>
    )
   }
   </>
  )
}

export default Page