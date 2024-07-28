//функция этого кода — сохранить данные в состоянии для аутентификации 
//потому что аутентификация не сохраняет данные в базе данных
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { log } from "console";
// создаем начальное состояние
const initialState = {
  user: "",
  token: "",
};

//Функция createSlice() генерирует редьюсер и действия к нему
const authSlice = createSlice({
  name: "auth",
  initialState, // инциализируем нач состояние
  reducers: {
//после успешной регистрация пользователя
 userRegistration: (state, action: PayloadAction<{ token: string }>) => {
   state.token = action.payload.token;
 },
  // userRegistration: (state, action) => {
  //        state.token = action.payload.token;
  //     },
// также логин пользователя
    //  userLoggedIn: (state, action) => {
    //        state.token = action.payload.accessToken;
    //         state.user = action.payload.user
    //    },

    //-------- ВХОД ----------------------------------------

userLoggedIn: ( state, action: PayloadAction<{ accessToken: string; user: string }>
    ) => {
        // if ( action.payload.user === undefined   && action.payload.accessToken === undefined  )
        // {
     //////// console.log( '======клиент =редюсер==userLoggedIn======== ', action.payload )  
      // state.token = ''
      // state.user =  ''
      // }
      // else {   
      state.token = action.payload.accessToken; //токен доступа
      state.user = action.payload.user;
      //  }
    },

//и выход пользователя из системы    
           userLoggedOut: (state) => {

//console.log( " выход  userLoggedOut authSlice.ts ")
                state.token = "";
               state.user ="";
                },
          }
});


 export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

 export default authSlice.reducer;
