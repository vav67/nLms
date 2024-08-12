import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
  import {
    useAddAnswerInQuestionMutation,
   useAddNewQuestionMutation,
    useAddReplyInReviewMutation,
   useAddReviewInCourseMutation,
    useGetCourseDetailsQuery,
    } from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format } from "timeago.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
  import { BiMessage } from "react-icons/bi";
 import { VscVerifiedFilled } from "react-icons/vsc";
  import Ratings from "@/app/utils/Ratings";

  import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number; //активное видео номер
  setActiveVideo: (activeVideo: number) => void;
  user: any;
            
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
   user,
 
  refetch,
}: Props) => {
  //состояния
     const [activeBar, setactiveBar] = useState(0); //панель 
  const [question, setQuestion] = useState("");//коментарий
   const [review, setReview] = useState("");//обзор
 
     const [rating, setRating] = useState(0);
 //ответ
  const [answer, setAnswer] = useState("");
//индетиф-р вопроса
   const [questionId, setQuestionId] = useState("");
//ответ на отзыв
   const [reply, setReply] = useState("");
  //айди отзыва
 const [reviewId, setReviewId] = useState("");
  //для просмотра ответа
   const [isReviewReply, setIsReviewReply] = useState(false);

 //вызов запрса на добавление  нового вопроса 
  const [ addNewQuestion,
   { isSuccess, error, isLoading: questionCreationLoading },
       ] = useAddNewQuestionMutation();

 
// получим детально курс       
       const { data: courseData, refetch: courseRefetch 
      } = useGetCourseDetailsQuery( id,  { refetchOnMountOrArgChange: true } );
 
    const course = courseData?.course;

  //вызов запроса на добавление  ответа на вопрос
  const [ addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError,
      isLoading: answerCreationLoading, },
        ] = useAddAnswerInQuestionMutation();

//выполняем  отзыв о курсе - добавить обзор
  const [ addReviewInCourse, {
  isSuccess: reviewSuccess,  error: reviewError,  isLoading: reviewCreationLoading,
      },   ] = useAddReviewInCourseMutation();

 //выполняем  ответ на отзыв
  const [ addReplyInReview, {
  isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading,
    },  ] = useAddReplyInReviewMutation();

  // найдем отзывы по курсу
  const isReviewExists =  data?.reviews?.find(    //course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

// отправим заданный вопрос  - /это вопросы-ответы
  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question can't be empty Вопрос не может быть пустым");
    } else {
  //фу-я вызова запрса на добавление  ответа на вопрос
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

// результаты выполнения двух разных запросов  
  useEffect(() => {
   if (isSuccess) {  //результат по опубликовании вопроса
      setQuestion("");
      refetch(); //повторная выборка с уже записанным вопросом
      toast.success("Question  aded successfully");
      socketId.emit("notification", {
        title: `New Question Received`,
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    //результат опубликовании ответа
      if (answerSuccess) {
      setAnswer(""); // очистим строку ответа 
        refetch(); //повторная выборка с уже записанным ответом
        if (user.role !== "admin") {
        socketId.emit("notification", {
          title: `New Reply Received`,
          message: `You have a new question in ${data[activeVideo].title}`,
          userId: user._id,
        });
       }
     }
    if (error) { //ошибка по вопросу
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
   if (answerError) { // ошибка по ответу на вопрос
      if ("data" in answerError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    } 
    if (reviewSuccess) { //обзор добавлен
      setReview("");
      //setRating(1);
      setRating(0);
      courseRefetch();
      toast.success("Review added seccessfully")
      socketId.emit("notification", {
        title: `New Question Received`,
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (reviewError) { //ошибка при добавлении обзора
      if ("data" in reviewError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }


    if (replySuccess) { // ответ на обзор
      setReply("");
      courseRefetch();
    }
    if (replyError) { // ошибка при ответе на обзор
      if ("data" in replyError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    //вопрос
    isSuccess, error,
    //ответ
     answerSuccess, answerError,
   // обзор  
     reviewSuccess, reviewError,
//  ответ на обзор
      replySuccess,    replyError,
  ]);

  //дескриптор обработка ответа на вопрос
  const handleAnswerSubmit = () => {
   // console.log("ответ=", answer)
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,//инд-р вопроса
    });
  };

  //сохранения  отзыв окурсе - добавить обзор
  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
   //выполнение 
        addReviewInCourse({ review, rating, courseId: id });
    }
  };

 // сохраняем ответ на отзыв
  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply can't be empty");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
       <CoursePlayer
       // отправим данные т.к.используем несколько видеоплейеров
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />  
   <div className="w-full flex items-center justify-between my-3">
  {/* это кнопка вверх по видеофайлам*/}
    <div className={`${  styles.button } text-white  !w-[unset] !min-h-[40px] !py-[unset] 
            ${ activeVideo === 0 && "!cursor-no-drop opacity-[.8]"    }`}
         
        onClick={() => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1) }
        >
           <AiOutlineArrowLeft className="mr-2" />  
          Prev Lesson Предыдущий урок
        </div>

  <div className={`${ styles.button } !w-[unset] text-white  !min-h-[40px] !py-[unset] 
          ${ data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"  }`}
          onClick={() =>  setActiveVideo(
     data && data.length - 1 === activeVideo ? activeVideo : activeVideo + 1 ) }
        >
          Next Lesson Следующий урок
          <AiOutlineArrowRight className="ml-2" />
        </div>  
      </div>  
      {/* название активного видео */}
      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black ">
        {data[activeVideo].title}
      </h1>  
      <br />
  {/* панель */}
       <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 
       backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
          {/* обзор   ресурсы  вопросы-ответы  отзывы  */}
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5  key={index}
            className={`800px:text-[20px] cursor-pointer ${
              activeBar === index  ? "text-red-500" : "dark:text-white text-black"  }`}
            onClick={() => setactiveBar(index)}
          >
              {text}
          </h5>
        ))}

      </div>  
      <br />
  {/* панель логика  */}
      {activeBar === 0 && ( // это обзор - показываем описание
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}  

      {activeBar === 1 && ( // это ресурсы
        <div>
           {data[activeVideo]?.links.map((item: any, index: number) => (
            <div  className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}       </h2>
              <a  className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}  
        </div>
      )}

      {activeBar === 2 && (  //это вопросы-ответы
        <>
         <div className="flex w-full">
            <Image
              src={
                user.avatar
                  ? user.avatar.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
             <textarea
              name=""
              value={question} //заданный вопрос
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write your question..."
              className="outline-none bg-transparent ml-3 border dark:text-white text-black border-[#0000001d] dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            ></textarea> 
          </div>
          <div className="w-full flex justify-end">
         <div  //кнопка отправки вопроса ответа
              className={`${ styles.button } !w-[120px] !h-[40px] text-[18px] mt-5  
                ${ questionCreationLoading && "cursor-not-allowed"}`}
          // пока грузиться не обрабатываем - ненажимаеться
                onClick={questionCreationLoading ? () => {} : handleQuestion}
            >
              Submit
            </div>  
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
        {/* ответ на вопрос компонент-коментарий */}
          <div>
             < CommentReply
            data={data}
                 activeVideo={activeVideo}
               answer={answer} //ответ
              setAnswer={setAnswer} //установка ответа
              //дескриптор обработка ответа отправить
              handleAnswerSubmit={handleAnswerSubmit}
          user={user}
        
          //индетиф-р вопроса  
           questionId={questionId}
             setQuestionId={setQuestionId}
             //загрузка комментария
           answerCreationLoading={answerCreationLoading}
            />   
          </div> 
        </>
      )}

      {activeBar === 3 && (  //отзывы
        <div className="w-full">
          <>
           {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={ user.avatar ? user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black ">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                     <div className="flex w-full ml-2 pb-3">
                   {/*  рейтинг звездочки */}
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                        
                    </div>
                  {/* обзор */}
                     <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Write your comment..."
                      className="outline-none bg-transparent 800px:ml-3 dark:text-white 
                      text-black border border-[#00000027] dark:border-[#ffffff57]
                       w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                    ></textarea>  
                  </div>
                </div>
                 <div className="w-full flex justify-end">
                  <div
                className={`${styles.button } !w-[120px] !h-[40px] text-[18px] mt-5
                 800px:mr-0 mr-2 ${ reviewCreationLoading && "cursor-no-drop" }`}
                   // сохраним статью
                   onClick={ reviewCreationLoading ? () => {} : handleReviewSubmit  }
                      >
                    Submit
                  </div>
                </div>  
              </>
            )}
                 <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
            <div className="w-full">
  {/* просмотр отзывов - обзоров */}
     {(course?.reviews && [...course.reviews].reverse())?.map(
                (item: any, index: number) => {
                  
                  return (
                    <div className="w-full my-5 dark:text-white text-black" key={index}>
                     <div className="w-full flex">
                        <div>
                      <Image  src={ item.user.avatar ? item.user.avatar.url
                      : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}  height={50}   alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                      <div className="ml-2">
                          <h1 className="text-[18px]">{item?.user.name}</h1>
                          <Ratings rating={item.rating} />
                          <p>{item.comment}</p>
                          <small className="text-[#0000009e] dark:text-[#ffffff83]">
                            {format(item.createdAt)} •
                          </small>
                        </div>  
                      </div>
                      {user.role === "admin" && item.commentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-10 cursor-pointer`}
                           onClick={() => {
                            setIsReviewReply(true);
                 setReviewId(item._id);// запишем айди отзыва
                            }}
                        >
                          Добавить ответ Add Reply
                        </span>
                      )}  

 {/* ответ на отзыв  */}
                      {isReviewReply && reviewId === item._id && (  
                          
                        <div className="w-full flex relative">
                          <input
                            type="text"
                            placeholder="Enter your reply..."
                             value={reply}
                             onChange={(e: any) => setReply(e.target.value)}
             className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] 
                          dark:border-[#fff] p-[5px] w-[95%]"
                          />
                          <button
                            type="submit"
                            className="absolute right-0 bottom-1"
                         onClick={handleReviewReplySubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}
  {/* пройдемся по ответам на отзыв - для отображения */}
                       {item.commentReplies.map((i: any, index: number) => (
                        <div className="w-full flex 800px:ml-16 my-5" key={index}>
                          <div className="w-[50px] h-[50px]">
                  <Image   src={ i.user.avatar   ? i.user.avatar.url
                       : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                              }
                        width={50} height={50}  alt=""
                              className="w-[50px] h-[50px] rounded-full object-cover"
                            />
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                              <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                            </div>
                            <p>{i.comment}</p>
                            <small className="text-[#ffffff83]">
                              {format(i.createdAt)} •
                            </small>
                          </div>
                        </div>
                      ))}
                     
                    </div>
                  );
                }  
              )} 
            </div>
          </>
        </div>
      )}

    </div>
  );
};

// компонент- коментарий вопроса
const CommentReply = ({
  data,
  activeVideo,
  answer, //ответ набор
  setAnswer, //установка ответа
  handleAnswerSubmit,//обработка ответа
                user,
  questionId,
   setQuestionId,
  answerCreationLoading,  //загрузка комментария
}: any) => {
  return (
    <>
      <div className="w-full my-3">
{/* пройдемся по вопросам    */}
    {data[activeVideo].questions.map((item: any, index: any) => (
         
   //  коментарий который нужно отправить
         <CommentItem
            key={index}
                  item={item}
          //  index={index}
            answer={answer}
            setAnswer={setAnswer}
             questionId={questionId}
          setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
      answerCreationLoading={answerCreationLoading}  //загрузка комментария
          />
        ))}   
      </div>
    </>
  );
};

//--------------------------- компонент коментарий
const CommentItem = ({
  setQuestionId,
  questionId,
  item,
  answer,
   setAnswer,
  handleAnswerSubmit,
 answerCreationLoading, //загрузка комментария
}: any) => {
  
  //в целях безопасности
  const [replyActive, setReplyActive] = useState(false);

  return (
    <>
      <div className="my-4">
        <div className="flex mb-2  ">
       
       
       
          <div>
            <Image
              src={ item.user.avatar? item.user.avatar.url
         : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }  width={50}  height={50} alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>  
           <div className="pl-3 dark:text-white text-black">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {!item.createdAt ? "" : format(item?.createdAt)} •
            </small>
          </div> 
    </div>

       <div className="w-full flex">
         <span
            className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
            // изменяем при нажатии и присвоим заданный индентиф-р вопроса
            onClick={ () => { // и вцелях безопасн-и изменим переменную
                 setReplyActive(!replyActive)
                  setQuestionId(item._id)}  
                   } >
          {!replyActive ? 
             item.questionReplies.length !== 0 ? "All Replies" : "Добавить ответ Add Reply" 
               : "Скрыть Hide Replies" }
          </span>
             
          <BiMessage size={20} //значок кол-ва коментарий на вопрос
            className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
            {item.questionReplies.length}
          </span>
        </div> 
 {/* /////////////если есть ответ///////////    */}
        {replyActive && questionId === item._id &&  ( 
            
          <>  
           {item.questionReplies.map((item: any) => (
            <div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"  key={item._id}> 
                 <div>
           <Image
            src={ item.user.avatar ? item.user.avatar.url
           : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                 } width={50}  height={50} alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                  <div className="pl-3">
                 <div className="flex items-center">  
                    <h5 className="text-[20px]">{item.user.name}</h5>{" "}
       {/* для админа добавим значок верификации  */}
        {item.user.role === "admin" && (
          <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                    )}
                  </div>  
                  <p>{item.answer}</p>  
                  <small className="text-[#ffffff83]">
                  { format(item?.createdAt) } •</small>
                </div>  
             </div>
            ))} 
 {/* /////наш ответ /////////// ////////////////*/}
           <>
              <div className="w-full flex relative text-black dark:text-white">
                 <input
                  type="text"
                  placeholder="Enter your ответ answer..."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
       // пустой ответ или загрузка ответа то курсора не будет
                  className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b
                   border-[#00000027] dark:text-white text-black 
                   dark:border-[#fff] p-[5px] w-[95%]
              ${ answer === "" || ( answerCreationLoading && "cursor-not-allowed")}
                   `}
                />
                <button
                  type="submit"
                 // className="absuolte right-0 bottom-1 "
                 className={`${ (answer === "" || answerCreationLoading) ?
                 "absuolte right-0 bottom-1 bg-slate-400  "    
                      : "absuolte right-0 bottom-1  bg-[crimson]"
                 }`}
                  onClick={handleAnswerSubmit}
                      // или  загрузка комментария        
                  disabled={answer === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </> 
         </>
        )}            


      </div>
     </>
   );
  };
 




//   // компонент коментарий
// const CommentItemm = ({
//   data,
//   activeVideo,
// questionId,
// // setQuestionId,
// item,
// answer,
// setAnswer,
// handleAnswerSubmit,
// // answerCreationLoading,
// }: any) => {
// const [replyActive, setreplyActive] = useState(false);
// console.log( '--item=', item)
// return (
//   <>
//     <div className="my-4">
//       <div className="flex mb-2 dark:text-white text-black">
//          <Image
//               src={
//                 item.user.avatar
//                   ? item.user.avatar.url
//                   : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
//               }
//               width={50}
//               height={50}
//               alt=""
//               className="w-[50px] h-[50px] rounded-full object-cover"
//             />
       
//         {/* < div className="w-[50px] h-[50px] ">
//           <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
//              <h1 className=" uppercase text-[18px]" >
//                  {item?.user.name.slice(0,2)}
//              </h1>
//           </div>
//          </div> */}

//        <div className="pl-3 dark:text-white text-black">
//           <h5 className="text-[20px]">{item?.user.name}</h5>
//             <p> {item?.question}</p>
//             <small className="text-[#ffffff83]">{!item?.createdAt ? "" 
//             : format(item?.createdAt)} •</small>
//        </div>
//      </div>
//    </div>
//      </>
//    );
//   };



 export default CourseContentMedia;
