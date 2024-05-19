"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile"; //боковая панель
  import ProfileInfo from "./ProfileInfo";
  import ChangePassword from "./ChangePassword";
  import { useLogOutQuery } from "@/redux/features/auth/authApi";
  import { signOut } from "next-auth/react";
  import CourseCard from "../Course/CourseCard";
      import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";

  import { useTheme } from "next-themes" //сам тема

type Props = {
    user: any;
    avatar: string | null;
  };
  
  const Profile: FC<Props> = ({ user }) => {
   
    //начальное состояния (переменные) 
   const { theme, setTheme } = useTheme() //сам для темы

    const [scroll, setScroll] = useState(false);
     const [avatar, setAvatar] = useState(null);
 //сам для модального окна    
   const [showConfirmation, setShowConfirmation] = useState(false);

     const [logout, setLogout] = useState(false);

     const [courses, setCourses] = useState([]);
// запрос о курсах  
const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});



     //вызов api запрос на выход пользователя 
     //если вы хотите предпринять дополнительные действия (например, отправить запрос на сервер) перед выходом пользователя из системы. Это может быть полезно, например, для очистки данных на стороне сервера перед завершением сеанса пользователя.
     const {} = useLogOutQuery(undefined, {skip: !logout ? true : false,   });

      const [active, setActive] = useState(1);


     const logOutHandler = async () => {

      if (!showConfirmation) {  //сам модальное окно
        setShowConfirmation(true);
      } else {

                        // console.log(' logOutHandler выход ')
  // так как хук useLogOutQuery внутри ф-ции не работант , то записываем в переменную                     
   setLogout(true); // что инициирует запрос на выход пользователя через useLogOutQuery
   // а затем дальше, для завершения процесса выхода пользователя с использованием NextAuth
       //   await signOut()  // метод выхода https://next-auth.js.org/getting-started/client
  await signOut({ callbackUrl: "/" })  
  //// await signOut()
       // redirect("/") signOut({ callbackUrl: "/login" }) 
     
      }
      };
  


    if (typeof window != "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 85) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      });
    }

//курсы
    useEffect(() => {
    //данные курсов получены  
      if (data) {
        const filteredCourses = user.courses
        .map( 
   (userCourse: any) =>data.course.find((course: any) => course._id === userCourse._id)
            )
        .filter((course: any) => course !== undefined);
        setCourses(filteredCourses); //запишем
      }
    }, [data]);


    return (
        <div className="w-[85%] flex mx-auto">
        <div
          className={ `w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 
        border bg-white border-[#ffffffld] rounded-[5px] shadow-sm mt-[80px] mb-[80px] 
          sticky ${ scroll ? "top-[120px]" : "top-[30px)" } left-[30px]`  }
        >

<SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />

</div>
{active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} theme={theme} />
        </div>
      )}
      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
           <ChangePassword />  
        </div>
      )}


      {active === 3 && ( //активные курсы
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} isProfile={true} />
              ))}
          </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )}



{/* модальное окно сам */}
{showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-4">
              Вы хотите выйти, уверены?
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={() => setShowConfirmation(false)}
              >
                Нет
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={logOutHandler}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}
{/* модальное окно сам ---------------------------*/}

    </div>
 
 
    )
}

export default Profile