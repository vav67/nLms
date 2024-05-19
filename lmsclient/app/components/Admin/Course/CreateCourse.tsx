"use client";
import React, { useEffect, useState } from "react";
import CourseOptions from "./CourseOptions";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
 import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = {};

const CreateCourse = (props: Props) => {
  //  создаем ф-ю для создания курса вызовом мутации
  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();
//результат выполнения запроса
    useEffect(() => {
    if (isSuccess) { //если все создано
      toast.success("Course created successfully");
      redirect("/admin/courses");
    }
    if (error) { //если ошибка создания курса
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isLoading, isSuccess, error]);
 

  // state 2- прошли три шага
    const [active, setActive] = useState(0);
    //инфо окурсе
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
        categories:"", //добавлено 09-08-49
    demoUrl: "",
    thumbnail: "",
  });
   
   //console.log( 'инфо курса=', courseInfo);

 // наша выгода
  const [benefits, setBenefits] = useState([{ title: "" }]);
  //состояние предварительные требования
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  
  //состояние курса начальное
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
            videoLength: "",   // 09-09-01 Длина нашего видео - число
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState({});
  

  // Объединяем всю внесенную ифор-цию
    const handleSubmit = async () => {
   // Format benefits array  выгода
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
  
   // Format prerequisites array форматированные предварительные требования
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

   // Format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
            videoLength: courseContent.videoLength, //09-17-06 добавили длину видео
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion, //предложение по содержанию курса
      })
    ); // массив закончили
  // подготовить наш объект данных
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
           categories: courseInfo.categories,//добавлена категория
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites, //отформатиров-е предварительные требования
      courseData: formattedCourseContentData,//отформа-е данные курса
    };
    setCourseData(data);
  };
  
  //Объединение данных в один объект  
   //console.log( 'данные курса=', courseData);

 
  const handleCourseCreate = async (e: any) => {
    const data = courseData;
    // console.log(data);
    if (!isLoading) {
      await createCourse(data); //созданме курса в бд
    }

  };
  

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
         {active === 0 && (
          <CourseInformation  //инфа о нашем курсе
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}  
        {/* итак следующий шаг */}
         {active === 1 && (
          <CourseData  // варианты нашего курса
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}  
       {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )} 
      {/* показан предварительный просмотр курса  */}
         {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
         isEdit={false}  //пусть будет "Update" : "Create" просмотр курса
            courseData={courseData}
           handleCourseCreate={handleCourseCreate}
          />
        )} 
      </div>
       <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        
        <CourseOptions active={active} setActive={setActive} />
      </div>  
    </div>
  );
};

export default CreateCourse;
