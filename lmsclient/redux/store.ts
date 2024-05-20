///////////"use client";
//конфигурация моего хранилища

import { configureStore } from "@reduxjs/toolkit";
  import { apiSlice } from "./features/api/apiSlice";
  import authSlice from "./features/auth/authSlice";

//конфигурируем из toolkit
export const store = configureStore({
  //указываем редюсеры (а можно корневой редюсер rootReducer )
  reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,//это как бы корневой - путь
     auth: authSlice,  // слайс аутентификации
  },
 //временно 
// devTools: false, 
  devTools: true,   //.  Он включен по умолчанию.

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware) 
}) 

/* https://egghead.io/lessons/redux-prefetch-data-in-rtk-query-using-an-endpoint-s-initiate-method 
RTK Query может начать получать данные в вашем приложении 
* еще до того, как React станет доступен. 
* Предварительная выборка основана на мощном 
* api.endpoints.<queryName>.initiate() методе, который лежит 
* в основе многих внутренних функций RTK Query. 
  Чтобы RTK-запрос правильно обрабатывал и сохранял вызовы
   инициализации(), их необходимо отправить в хранилище redux 
   с помощью store.dispatch().
* */


// // call the load user function on every page load
// //вызывать функцию загрузки юзера при загрузке страни
// const initializeApp = async () => {
//  //вызываем токен обновления 06-45-45 
//  // 07-58-46 это теперь отключено 
//  // так как это обновление полностью  работает над серверной частью
//   //  await store.dispatch(
//   //   apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true }) 
//   //  );

  
//    await store.dispatch(
//          apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
//    );

// };

//   initializeApp()  // запускаем пробую опять после как добавил
  //  updateAccessToken, //рефреш до аутентифик-и 06-47-29 "синхронизация" обновляет токен там next()
