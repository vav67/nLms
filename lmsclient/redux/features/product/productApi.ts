import { apiSlice } from "../api/apiSlice";
import { IProduct } from "./types";

 
export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
 // создание   
    createProduct: builder.mutation<IProduct, FormData>({
      query: ( formData ) => ({ 
        url: "create-product",
        method: "POST",
        // headers: {
        //     // Важно! Не указывайте Content-Type, если body является FormData
        //     // Он автоматически устанавливается на "multipart/form-data"
        //   },
        body: formData, // передаем FormData напрямую
        credentials: "include" as const,
      }),
    }),




    //===========================================
}),
});

export const {
    useCreateProductMutation
} = productApi;