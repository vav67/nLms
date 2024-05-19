"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Suspense } from "react"
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";


import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";
 


   type Props = {};
////// router.push(`/courses?title=${search}`);

  const SuccessComponent = (props: Props) => {
  //const Page = () => {
// получили параметром поиск
     const searchParams = useSearchParams()
      //берем значение 
    const search = searchParams?.get("title");
  //const search = "аааааааааа"
  //запрос на получение курсов
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
//запрс на  получение категорий
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  //состояния создадим
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setcourses] = useState([]);
  const [category, setCategory] = useState("All");
  // const [myy, setMyy] = useState([]);
  
  useEffect(() => {
    // console.log( '=========== поск data=', data )
    // setMyy( data?.course.filter((item: any) => {
    //  if ( item.categories === category ) { return item}
    //   console.log(  '**** ', category,'=category========== categories = ', item.categories )
       
    // }) )
    // console.log(  '========== myy= ', myy)

  //   if (category === "All") { setcourses(data?.course); 
  //   }
  //   if (category !== "All") {
  // setcourses( data?.course.filter((item: any) => item.categories === category) );
 
  //   }
  //  // и затем еще одна проверка
  //   if ( search  ) { // поиск  
  //      setcourses( data?.course.filter((item: any) =>
  //               item.name.toLowerCase().includes(search.toLowerCase()) ) )
   
  //   }

    // пробую заменить
    if ( search && category) { // поиск  
      setcourses( data?.course.filter((item: any) => {

        if ( item.name.toLowerCase().includes(search.toLowerCase()))
        {
          if ( category === "All") { return item } 
          if ( item.categories === category) { return item }
        }
               
    }) )
  
   } else {
         if (category === "All") { setcourses(data?.course)  } else {
            setcourses( data?.course.filter((item: any) => item.categories === category) );
               }
         }

    

  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories;

  return (
    
 
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title={"All courses - Elearning"}
              description={"Elearning is a programming community."}
              keywords={
                "programming community, coding skills, expert insights, collaboration, growth"
              }
            />
            <br />
            <div> <span>поиск по {search}   </span></div>
            <div className="w-full flex items-center flex-wrap">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                onClick={() => setCategory("All")}
              >
                All
              </div>
              {categories &&
                categories.map((item: any, index: number) => (
                  <div key={index}>
                    <div
                      className={`h-[35px] ${
                        category === item.title
                          ? "bg-[crimson]"
                          : "bg-[#5050cb]"
                      } m-3 px-3  text-white   rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                      onClick={() => setCategory(item.title)}
                    >
                      {item.title}
                    </div>
                  </div>
                ))}
            </div>
            {
                courses && courses.length === 0 && (
                    <p className={`${styles.label} justify-center min-h-[50vh] flex items-center`}>
                    {search ? "No courses found!" : "No courses found in this category. Please try another one!"}
                  </p>
                )
            }
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
              {courses &&
                courses.map((item: any, index: number) =>  
                 {  return (               <div>
                     fffffffff= {item.categories }
                
                  <CourseCard item={item} key={index} />
                    </div>
                )}
                 )}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
    
    
  );
};

export default SuccessComponent;