//функция этого кода — сохранить данные в состоянии для аутентификации 
//потому что аутентификация не сохраняет данные в базе данных
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
 
// создаем начальное состояние
const initialState = {
    message: "",
    activationTokenShop: "",

    seller:"",  //{},
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
    seller: string }>
     ) => {
 
     
state.seller = action.payload.seller; // инфа об магазине
state.accessTokenShop = action.payload.accessTokenShop;

},



 
shopInseller: ( state, action: PayloadAction<{ seller: string }>
   ) => {
    console.log( '%%%=shopInseller=====', action.payload.seller  )   
 state.seller = action.payload.seller; // инфа о продавце магазине
 },

 




          }
});




 export const { shopRegistration, shopLoggedIn, 
  shopInseller,
 } = shopSlice.actions;

  export default shopSlice.reducer;
 