import { apiSlice } from "../api/apiSlice";

//Курсы 
export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
 // создание курса   
    createCourse: builder.mutation({
      query: (data) => ({ //отправим как простые данные (а не объект{data} )
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
//выбрать все курсы , только администратор
    getAllCourses: builder.query({
      query: () => ({
     url: "get-admin-courses",
          method: "GET",
        credentials: "include" as const,
      }),
    }),


    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  
      editCourse: builder.mutation({
      query: ({ id, data }) => ({ // айди и данные
        url: `edit-course/${id}`,
        method: "PUT",
        body: data, //просто данные отправим в боду 
        credentials: "include" as const,
      }),
    }),

    //получить все  пользовательские курсы - для всех
    getUsersAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // курсы в деталях
    getCourseDetails: builder.query({
      query: (id: any) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

 //содержание курса
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
//добавляем новые впросы
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

// ответ на вопрос
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

//отзыв окурсе - добавить обзор
    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }: any) => ({
        url: `add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
//ответ на отзыв
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `add-reply`,
        body: {
          comment, courseId, reviewId
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),



  }),
});

export const {
   useCreateCourseMutation,
   useGetAllCoursesQuery,
useDeleteCourseMutation,
          useEditCourseMutation,

   
  useGetUsersAllCoursesQuery,
                useGetCourseDetailsQuery,
  useGetCourseContentQuery,
          useAddNewQuestionMutation,
   useAddAnswerInQuestionMutation,
   useAddReviewInCourseMutation,
    useAddReplyInReviewMutation       
} = courseApi;
