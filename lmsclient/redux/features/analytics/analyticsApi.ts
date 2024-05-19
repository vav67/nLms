import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // курсов
        getCoursesAnalytics: builder.query({
            query: () => ({
                url: 'get-courses-analytics',
                method: 'GET',
                credentials: 'include' as const,
            }),
        }),
    //пользователи
        getUsersAnalytics: builder.query({
            query: () => ({
                url: 'get-users-analytics',
                method: 'GET',
                credentials: 'include' as const,
            })
        }),
  //аналитика заказов  
        getOrdersAnalytics: builder.query({
            query: () => ({
                url: 'get-orders-analytics',
                method: 'GET',
                credentials: 'include' as const,
            })
        }),

    }),
});

export const { 
    useGetCoursesAnalyticsQuery,
 useGetUsersAnalyticsQuery,
   useGetOrdersAnalyticsQuery 
           } = analyticsApi;