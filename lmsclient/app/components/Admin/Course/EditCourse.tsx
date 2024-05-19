"use client";
import React, { FC, useEffect, useState } from "react";
import CourseOptions from "./CourseOptions";
import CourseInformation from "./CourseInformation";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

type Props = { id: string };

//скопируем из CreateCourse

const EditCourse: FC<Props> = ({ id }) => {
 //состояния переменные 
  //console.log( 'индентификатор курса id=', id)
  //mendekalrasikan api editcourse
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  
  //получаем все курсы и перегружать можем
  const { data, refetch } = 
     useGetAllCoursesQuery( {}, { refetchOnMountOrArgChange: true } );


  // находим по айди, курс
  const editCourseData = data && data.courses.find((i: any) => i._id === id);
   // console.log( 'курс= ', editCourseData);

//результат выполнения запроса апгрейда курса
  useEffect(() => {
    if (isSuccess) { //если все создано
      toast.success("Course updated successfully");
      redirect("/admin/courses");//переходим
    }
    if (error) {   //если ошибка создания курса
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const [active, setActive] = useState(0);

  useEffect(() => {

    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData?.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData.level,
                 categories:editCourseData.categories,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData?.thumbnail?.url,
      });
      setBenefits(editCourseData.benefits);
      setPrerequisites(editCourseData.prerequisites);
      setCourseContentData(editCourseData.courseData);
    }
  }, [editCourseData]);


 //инфо окурсе----------------------------------
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
              categories:"",
    demoUrl: "",
    thumbnail: "",
  });
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
    // Format benefits array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // Format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    // Format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        //предложение по содержанию курса
        suggestion: courseContent.suggestion,
      })
    );// массив закончили
    // подготовить наш объект данных
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
             categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContentData,  //courseContent: formattedCourseContentData,
    };
    setCourseData(data); // записываем в состояние
  };
 
  //Объединение данных в один объект  
  const handleCourseCreate = async (e: any) => {
    const data = courseData;
    //выполняем отправку данных на сервер
    await editCourse({ id: editCourseData?._id,  data });
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
          <CourseData // варианты нашего курса
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
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
