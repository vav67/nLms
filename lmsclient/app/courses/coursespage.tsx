import React from 'react'

const coursespage = () => {
  return (
    <div>coursespage</div>
  )
}

export default coursespage





//=========================================================
// "use client";

// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { Suspense } from "react"
// import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
// import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";


// import Loader from "../components/Loader/Loader";
// import Header from "../components/Header";
// import Heading from "../utils/Heading";
// import { styles } from "../styles/style";
// import CourseCard from "../components/Course/CourseCard";
// import Footer from "../components/Footer";
 


//    type Props = {};
// ////// router.push(`/courses?title=${search}`);

//   const Page = (props: Props) => {
//   //const Page = () => {
// // получили параметром поиск
//   // пока   
//       const searchParams = useSearchParams()
//       //берем значение 
//   const search = searchParams?.get("title");
 
// //   //запрос на получение курсов
// //   const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
// // //запрс на  получение категорий
// //   const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
// //   //состояния создадим
// //   const [route, setRoute] = useState("Login");
// //   const [open, setOpen] = useState(false);
// //   const [courses, setcourses] = useState([]);
// //   const [category, setCategory] = useState("All");
// //   // const [myy, setMyy] = useState([]);
  
// //   useEffect(() => {
// //     // console.log( '=========== поск data=', data )
// //     // setMyy( data?.course.filter((item: any) => {
// //     //  if ( item.categories === category ) { return item}
// //     //   console.log(  '**** ', category,'=category========== categories = ', item.categories )
       
// //     // }) )
// //     // console.log(  '========== myy= ', myy)

// //   //   if (category === "All") { setcourses(data?.course); 
// //   //   }
// //   //   if (category !== "All") {
// //   // setcourses( data?.course.filter((item: any) => item.categories === category) );
 
// //   //   }
// //   //  // и затем еще одна проверка
// //   //   if ( search  ) { // поиск  
// //   //      setcourses( data?.course.filter((item: any) =>
// //   //               item.name.toLowerCase().includes(search.toLowerCase()) ) )
   
// //   //   }

// //     // пробую заменить
// //     if ( search && category) { // поиск  
// //       setcourses( data?.course.filter((item: any) => {

// //         if ( item.name.toLowerCase().includes(search.toLowerCase()))
// //         {
// //           if ( category === "All") { return item } 
// //           if ( item.categories === category) { return item }
// //         }
               
// //     }) )
  
// //    } else {
// //          if (category === "All") { setcourses(data?.course)  } else {
// //             setcourses( data?.course.filter((item: any) => item.categories === category) );
// //                }
// //          }

    

// //   }, [data, category, search]);

// //   const categories = categoriesData?.layout?.categories;

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//     <div>
//     <span> search = {search }  </span>
//     </div>
    
//     </Suspense>
//   );
// };

// export default Page;

