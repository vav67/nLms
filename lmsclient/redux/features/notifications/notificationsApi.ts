import { apiSlice } from "../api/apiSlice";

//слайс уведомления - две конечные точки
export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({  // получение всех уведомлений
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateNotificationStatus: builder.mutation({
      query: (id) => ({ //обновление уведомления
        url: `/update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
