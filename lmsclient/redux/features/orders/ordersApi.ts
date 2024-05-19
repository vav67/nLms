import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   // все заказы 
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

//передаем ключ
    getStripePublishablekey: builder.query({
      query: () => ({
        url: `payment/stripepublishablekey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
// оплата
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: {       amount,      },
        credentials: "include" as const,
      }),
    }),
 //создание заказа   
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        body: {    courseId,      payment_info,    },
        method: "POST",
        credentials: "include" as const,
      }),
    }),


  }),
});

export const { 
  useGetAllOrdersQuery,
  useGetStripePublishablekeyQuery,
   useCreatePaymentIntentMutation ,
   useCreateOrderMutation
} =   ordersApi;
