import { apiSlice } from "../api/apiSlice";


export const userApi = apiSlice.injectEndpoints({
 
  endpoints: (builder) => ({

      updateAvatar: builder.mutation({
      query: (avatar) => ({ 
        url: "update-user-avatar", //из server/routes/user.route.ts  "/update-user-avatar" updateProfilePicture
        method: "PUT",
           body: { avatar }, //на сервере параметры const { avatar } = req.body;const userId = req.user?._id;
        credentials: "include" as const, //полномочия включены
      }),
      //-----------возвращает в слайс для strore (виртуальное сохранение)
     // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
     ///   try {
     //     dispatch( userLoggedOut() ) //в редюсер слайса
     //   } catch (error: any) {  console.log(error);  }
     // },
     //-----самому доделать надо -------
    }),

    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-user-info",
        method: "PUT",
        body: { name, },
        credentials: "include" as const,
      }),
          //-----------возвращает в слайс для strore (виртуальное сохранение)
     // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
     ///   try {
     //     dispatch( userLoggedOut() ) //в редюсер слайса
     //   } catch (error: any) {  console.log(error);  }
     // },
     //-----самому доделать надо -------
    
    
    }),


    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

   //  все юзеры
    getAllUsers: builder.query({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,//полномочия включены
      }),
    }),

    //удаление юзера  
    updateUserRole: builder.mutation({
      query: ({ email, role }) => ({
        url: "update-user",
        method: "PUT",
        body: { email, role },
        credentials: "include" as const,//полномочия включены
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const result = await queryFulfilled; //получили ответ
      //     dispatch( //вызываем с данными результата для сохранения в store
      //       userLoggedIn({
      //         accessToken: result.data.accessToken,
      //         user: result.data.user,
      //       })
      //     );
      //   } catch (error: any) { console.log(error); }
      // },
    }),


   
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,  ///delete-user/:id
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  

  
   }),
});

export const {
   useUpdateAvatarMutation,
    useEditProfileMutation,
   useUpdatePasswordMutation  ,
     useGetAllUsersQuery,
   useUpdateUserRoleMutation,           
   useDeleteUserMutation,
} = userApi;
