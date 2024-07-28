import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

//Каждый новый *api создаем ( чанки ), расширяя базовый apiSlice
//, при этом   больше не надо изменять store.ts 
export const authApi = apiSlice.injectEndpoints({
  //формируем эндпоинты
       endpoints: (builder) => ({
    //используем pessimistic обновление, после ответа сервера    
// ниже описываються методы ( query (GET запрос)- получает данные от сервера
//                            mutation ( POST, PUT запрос  )-чтобы данные изменять        )
        // endpoints here // здесь конечные точки

//-------------  Регистрация ------------------------------------------------------------------------------        
    register: builder.mutation<RegistrationResponse, RegistrationData>({
   query: (data) => ({
            url: "registration", // это добавиться к базовому эндпоинту
            method: "POST",
            body: data,   //тело запроса
/*(пример ) credentials: 'include' - это про передачу кук и
* авторизационных заголовков, а у вас jwt-токен, который вам 
*надо руками добавить в заголовки всех последующих запросов:
* Authorization: Bearer   your-jwt-token  
*/  
//include - всегда отправляйте учетные данные пользователя 
// (файлы cookie, базовую HTTP-аутентификацию и т. д.), даже
// для вызовов между источниками. 
            credentials: "include" as const,
              }),
 /**Часто при работе с асинхронными вызовами, до и после отправки запроса,
* необходимо осуществить дополнительное действие. Для этих целей стоит использовать 
* onQueryStarted. Модифицировать запрос не получится, однако возможно отследить 
* его состояние с помощью queryFulfilled
 */    
  //arg -аргументы       
  async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; //результат ответа на запрос
            dispatch(
userRegistration({ token: result.data.activationToken, })
                    );
        } catch (error: any) {  console.log( 'ош=', error)    }
      },
    }),


//--------------Активация--------------------------------------------------    
//следующий эндпоинт  - чанк
activation: builder.mutation({
  query: ({ activation_token, activation_code }) => ({
    url: "activate-user",//добавим к пути
    method: "POST",
    body: { //передаем  токен и   код активации   
      activation_token,
      activation_code,
    },
  }),
}),

//------------- вход --------------------------------------------------------------
//следующий эндпоинт  - чанк
login: builder.mutation({
  query: ({ email, password }) => ({
    url: "login", //добавим к пути
    method: "POST",
    body: {
      email,
      password,
    },

/*(пример ) credentials: 'include' - это про передачу кук и
* авторизационных заголовков, а у вас jwt-токен, который вам 
*надо руками добавить в заголовки всех последующих запросов:
* Authorization: Bearer   your-jwt-token  
*/  
//include - всегда отправляйте учетные данные пользователя 
// (файлы cookie, базовую HTTP-аутентификацию и т. д.), даже
// для вызовов между источниками.  
credentials: "include" as const, 
  }),
   /**Часто при работе с асинхронными вызовами, до и после отправки запроса,
* необходимо осуществить дополнительное действие. Для этих целей стоит использовать 
* onQueryStarted. Модифицировать запрос не получится, однако возможно отследить 
* его состояние с помощью queryFulfilled
 */    
  //arg -аргументы       
  async onQueryStarted(arg, { queryFulfilled, dispatch }) {
    try {
      const result = await queryFulfilled; //получили ответ
      dispatch( //вызываем с данными результата для сохранения в store
        userLoggedIn({
          accessToken: result.data.accessToken,
          user: result.data.user,
        })
      );
    } catch (error: any) {
      console.log("login ошибка=",error);
    }
  },
}),

//------------вход социальных сетей ----------------------------------------------------------------------
//функция социальных сетей
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
   url: "social-auth", //из server/routes/user.route.ts  socialAuth (email, name, avatar )
        method: "POST",
        body: { email, name,  avatar,  },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;  
          dispatch(  
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) { console.log(error); }
      },
    }),

//выход юзера
    logOut: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch( userLoggedOut() ) //в редюсер слайса
        } catch (error: any) {  console.log(error);  }
      },
    }),


   }),
  }) 

export const {
  useRegisterMutation,
  useActivationMutation,
 
  useLoginMutation,
  useSocialAuthMutation,
                      useLogOutQuery,
} = authApi;
