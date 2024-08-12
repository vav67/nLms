import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";
 

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

// RTK query------------------------------

// createApi() adalah sebuah fungsi yang digunakan untuk membuat objek API slice dalam Redux Toolkit Query.
// Fungsi ini menerima sebuah objek konfigurasi yang digunakan untuk mengatur perilaku API slice, seperti reducerPath, baseQuery, dan endpoints.
// reducerPath adalah nama slice Redux yang akan digunakan untuk mengelola data yang diterima dari permintaan API.
// baseQuery adalah fungsi yang digunakan untuk mengonfigurasi detail permintaan HTTP seperti URL dasar, opsi, dan lainnya.
// endpoints adalah tempat Anda mendefinisikan endpoint-endpoint API dan perilaku kustom untuk permintaan dan tanggapan.
/**
createApi() — это функция, используемая для создания объектов среза API в запросе 
       Redux Toolkit.   Эта функция принимает объект конфигурации, который используется для
       установки поведения API среза, например, редуктора Path, baseQuery и конечных точек. 
reducerPath — имя слайса Redux, который будет использоваться для управления данными, 
       полученными по запросам API. 
baseQuery — это функция, используемая для настройки деталей HTTP-запроса, таких как 
        базовый URL-адрес, параметры и т. д. 
endpoint -конечные точки — здесь вы определяете конечные точки API и настраиваемое поведение для 
          запросов и ответов.
 */
  //создаем apiSlice - сущность, которая будет хранить общие настройки. Ее удобно расширять 
  //остальными *api в приложении, которые автоматически получат 
  //baseUrl (будет добавляться ко всем запросам), headers (см. пример) и
  // tagTypes (для инвалидации кешей).
export const apiSlice = createApi({
  reducerPath: "api", //1  ( это уникальный ключ определяет однозначно текущий сервис )
  baseQuery: fetchBaseQuery({ //2 используемая для настройки деталей HTTP-запроса 
        // это базовый URL куда отправляем запросы
                     baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,


                     }),
  endpoints: (builder) => ({
     //3 описываем все эндпоинты ( конечные точки API) на котрые мы будем
          //отправлять запросы и изменять наше состояние  т.е. возвращает некоторый объект
// ниже описываються методы ( query (GET запрос)- получает данные от сервера
//                            mutation ( POST, PUT запрос  )-чтобы данные изменять        )
// и возвращ объект {data, error, isLoading}    
 //вырполняем обновление   02-25-50
refreshToken: builder.query({  
      query: (data) => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const, 
      }),
    }),



//  //выполняем загрузку юзеров    
//     OLdloadUser: builder.query({
//       query: (data) => ({
//         url: "memmmmmm",
//         method: "GET",
//         credentials: "include" as const,
//       }),
// // получим
//    /**Часто при работе с асинхронными вызовами, до и после отправки запроса,
// * необходимо осуществить дополнительное действие. Для этих целей стоит использовать 
// * onQueryStarted. Модифицировать запрос не получится, однако возможно отследить 
// * его состояние с помощью queryFulfilled
//  */    
//   //arg -аргументы
//    async onQueryStarted(arg, { queryFulfilled, dispatch }) {
//         try {
//      // console.log( '----------------onQueryStarted начало' );
//           const result = await queryFulfilled;
//           //const { data } = await queryFulfilled;
//           //   console.log(data);
//         //  console.log( '----------onQueryStarted result.data.=', result );
//      {/* 
//      https://github.com/reduxjs/redux-toolkit/issues/2064
//      Моим окончательным решением было обновить каждый onQueryStarted
//     let res = await queryFulfilled.catch(e => ({error: e}))
//            if (error in res) return;
//              // ... dispatch logic
//     */}
     
// //      if ( result.data.user === undefined  )
// //      {
// //       console.log( 'ПРОБАЮЗЕР=====onQueryStarted  ЮЗЕР ПУСТОЙ' )  

// //      }
// //  else {
//           dispatch(
//             userLoggedIn({
//               accessToken: result.data.accessToken,
//               user: result.data.user,
//             })
//           );
//     //  }
//         } catch (error: any) {
//           console.log( 'onQueryStarted ОШИБКА====== ', error);
         
 
// // Обработка ошибки более подробно
// // if (error.status === 401) {
// //     // Обработка случая, когда получен статус 401 (Unauthorized)
// //     console.log('Ошибка 401: Пользователь не авторизован');
// // } else {
// //     // Обработка других возможных ошибок
// //     console.error('Произошла ошибка при выполнении запроса:', error);
// // }


//         }
//       },
//     }),
//--------------------------------------------------------------
loadUser: builder.query  ({
  query: (data) => ({
    url: "me",
    method: "POST", ////////////////////////изменено
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
    } catch (error: any) {
      console.log(error);
    }
  },
}),
//------------------------------------------------------------

// meSeller: builder.query({  // запрос автоматом срабатывает

//   query: (data) => ({
//       url: "meseller",
//       method: "POST", ////////////////////////изменено
//       credentials: "include" as const,
//     }),
//     async onQueryStarted(arg, { queryFulfilled, dispatch }) {
//       try {
         
//         const result = await queryFulfilled;
   
//         console.log( '%%%=meseller=====', result.data.seller  )
  
//         dispatch(
//            shopInseller({    seller: result.data.seller      })
//         );
  
//       } catch (error: any) {
//         console.log(error);
//       }
//     },
//   }),
  
  
  
  
  
  
  


//------------------------------------------------------
   }),
})
export const { 
        useRefreshTokenQuery, 
        useLoadUserQuery,
    //    useLazyOLdloadUserQuery 
//useMeSellerQuery

 } = apiSlice;

 