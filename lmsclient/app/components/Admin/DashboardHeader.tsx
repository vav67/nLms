"use client";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";

import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });


type Props = {
  open?: boolean;
  setOpen?: any;
};




//компонент правой части адми нанели
const DashboardHeader: FC<Props> = ({ open, setOpen })  => {
 
//заменим на пропс  const [open, setOpen] = useState(false);
 //получаем все уведомления
const { data, refetch } = useGetAllNotificationsQuery(undefined, {
  refetchOnMountOrArgChange: true,
});
//обновление уведомления
const [updateNotificationStatus, { isSuccess }] =  useUpdateNotificationStatusMutation();

const [notifications, setNotifications] = useState<any>([]);//уведомление

// звук сохраненный или можем приделать свой звук
const [audio] = useState<any>(
  typeof window !== "undefined" &&
    new Audio(
      "https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/notification_vcetjn.mp3"
    )
);
//ф-я проигрывания звука
const playNotificationSound = () => {  audio.play(); };


useEffect(() => {
  if (data) { //получили все уведомления
    setNotifications( //фильтруем, выбираем все со статусом непрочитан
      data.notifications.filter((item: any) => item.status === "unread")
    );
  }
  if (isSuccess) {  refetch(); } //обнови наше уведомление
  
  audio.load();//звук загружаем

}, [data, isSuccess, audio]);

useEffect(() => {
  socketId.on("newNotification", (data) => {
    refetch();
    playNotificationSound();
  });
}, []);

// обновим статус
const handleNotificationStatusChange = async (id: string) => {
  await updateNotificationStatus(id);
};
 
  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
{/* какая тема установлена       */}
      <ThemeSwitcher /> 
   <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
      {/* колокольчик */}
  <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
        {notifications && notifications.length}
        </span>
      </div>

 {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications Сообщения
            </h5>
      {notifications &&
            notifications.map((item: any, index: number) => (
                <div
       className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                key={index}
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <p
                    className="text-black dark:text-white cursor-pointer"
                    // как прочитано
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {item.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {format(item.createdAt)}
                </p>
              </div>
            ))}

        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
