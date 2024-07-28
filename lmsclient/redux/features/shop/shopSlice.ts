//функция этого кода — сохранить данные в состоянии для аутентификации 
//потому что аутентификация не сохраняет данные в базе данных
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
 
// создаем начальное состояние
const initialState = {
    message: "",
    activationTokenShop: "",

    seller:{},
    accessTokenShop:"",
};

//Функция createSlice() генерирует редьюсер и действия к нему
const shopSlice = createSlice({
  name: "shop",
  initialState, // инциализируем нач состояние
  reducers: {
//после успешной регистрация пользователя
shopRegistration: (state, action: PayloadAction<{ 
    activationTokenShop: string, message:string }>) => {
   state.activationTokenShop = action.payload.activationTokenShop;
   state.message = action.payload.message;
 },
 
    //-------- ВХОД ----------------------------------------

  shopLoggedIn: ( state, action: PayloadAction<{
    accessTokenShop: string;
    seller: object }>
     ) => {
//         // if ( action.payload.user === undefined   && action.payload.accessToken === undefined  )
//         // {
//      //////// console.log( '======клиент =редюсер==userLoggedIn======== ', action.payload )  
//       // state.token = ''
//       // state.user =  ''
//       // }
//       // else {   
//       state.token = action.payload.accessToken; //токен доступа
//       state.user = action.payload.user;
//       //  }
     
state.seller = action.payload.seller; // инфа об магазине
state.accessTokenShop = action.payload.accessTokenShop;

},



 
shopInseller: ( state, action: PayloadAction<{ seller: object }>
   ) => {
 state.seller = action.payload.seller; // инфа о продавце магазине
 },

 




          }
});




 export const { shopRegistration, shopLoggedIn, 
  shopInseller,
 } = shopSlice.actions;

 export default shopSlice.reducer;