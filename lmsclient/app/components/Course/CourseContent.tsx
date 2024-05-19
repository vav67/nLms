import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
 import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
  id: string; //идетиф-р нашего курса
  user:any; // пользователь
};

const CourseContent = ({ id, user }: Props) => {
//запрос на контент курса
  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(
    id, {refetchOnMountOrArgChange:true} );
  //состояние
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState('Login')
  const data = contentData?.content;

  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
         <>   {/* заголовок  первый активен и открытый  начальное это login */ }
   <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />

          <div className="w-full grid 800px:grid-cols-10">
             <Heading
              title={data[activeVideo]?.title}
              description="anything"
              keywords={data[activeVideo]?.tags}
            />  
           <div className="col-span-7">
       <CourseContentMedia
            //02-46-40 передаем формат и медиаконтент в этом курсе    
                data={data}
                id={id} // айжи курса
                activeVideo={activeVideo} //активное видео
                setActiveVideo={setActiveVideo}
                  user={user}  //пользователь
                refetch={refetch}
              /> 
            </div> 
            <div className="hidden 800px:block 800px:col-span-3">
      <CourseContentList  //содержание курса список
              setActiveVideo={setActiveVideo}
              data={data}
              activeVideo={activeVideo} //активное видео
            />
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseContent;
