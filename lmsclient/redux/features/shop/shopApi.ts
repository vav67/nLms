import { apiSlice } from "../api/apiSlice";
import { shopLoggedIn, shopRegistration,
  shopInseller,
 } from "./shopSlice";

type RegistrationResponse = {
  message: string;
  activationTokenShop: string;
};

type RegistrationData = {};


export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
  //-------- регистрация ----------------------------  
 // registershop: builder.mutation<RegistrationResponse, RegistrationData>({
    registershop: builder.mutation ({
      query: (data) => ({ //данные type к запросу
        url: `create-shop`,
        method: "POST",
        body: data, 
        credentials: "include" as const,
      }),
 

   async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      try {
        const result = await queryFulfilled; //результат ответа на запрос
          dispatch(
 shopRegistration({ activationTokenShop: result.data.activationTokenShop,
  message: result.data.message,    
  }) );
      } catch (error: any) {  console.log( 'ош=', error)    }
    },
  }), 

 
//------------ активация ---------------
    activationshop: builder.mutation({
   query: ({activation_token_shop, activation_code_shop, activation_user_email }) => ({
        url: `activate-shop`,
     body: {  activation_token_shop, activation_code_shop, activation_user_email  },
     method: "POST",
        credentials: "include" as const,
      }),
      
    }),



// ------------Вход логинимся------------------

//следующий эндпоинт  - чанк
    loginshop: builder.mutation({
  query: ({ email, password }) => ({
    url: "login-shop", //добавим к пути
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
//возвращ = success: true,  user, accessTokenShop,   
  //arg -аргументы       
  async onQueryStarted(arg, { queryFulfilled, dispatch }) {
    try {
      const result = await queryFulfilled; //получили ответ
      dispatch( //вызываем с данными результата для сохранения в store
        shopLoggedIn({
          accessTokenShop: result.data.accessTokenShop,
          seller: result.data.seller, //это данные магазина
        })
      );
    } catch (error: any) {
      console.log("login ошибка=",error);
    }
  },
}),


//----------аутентификация прордавца магазина ---------------------
 //C:\Users\qq\15-07-2024 соединение приложений\!!! запросы API query или mutation.txt
//loadSeller: builder.mutation({ //запрос вручную срабатывае
 meSeller: builder.query({  // запрос автоматом срабатывает

query: (data) => ({
    url: "meseller",
    method: "POST", ////////////////////////изменено
    credentials: "include" as const,
  }),
  async onQueryStarted(arg, { queryFulfilled, dispatch }) {
    try {
       
      const result = await queryFulfilled;
 
      dispatch(
       // sellerLoggedIn({
        shopInseller ({    seller: result.data.seller,      })
      );

    } catch (error: any) {
      console.log(error);
    }
  },
}),








}),
});

export const { 
  useRegistershopMutation,
  useActivationshopMutation,
useLoginshopMutation,
 useMeSellerQuery
 
      } = shopApi;