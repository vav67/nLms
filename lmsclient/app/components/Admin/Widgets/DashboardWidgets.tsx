import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
  import OrdersAnalytics from "../Analytics/OrdersAnalytics";
  import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
   value?: number;
};
//создаем внутренний компонент
const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"} //цвет взят из исходника
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", 
        display: "flex",  alignItems: "center", justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
 //сравнение процентов заказов
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  //сравнение процентов юзеров
  const [userComparePercentage, setuserComparePercentage] = useState<any>();

  const { data,   isLoading   } = useGetUsersAnalyticsQuery({});
  const { data:ordersData,  isLoading:ordersLoading } =
                                  useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    // получили данные
    if (isLoading && ordersLoading) { // загружаються
      return;
    } else {
      if (data && ordersData) {
        // за последние два месяца
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          //юзеры
          const usersCurrentMonth = usersLastTwoMonths[1].count; //текущий месяц
          const usersPreviousMonth = usersLastTwoMonths[0].count; //предыдущий месяц
          //заказы
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        // надо будет правильно посчитать процент с прошлым месяцем  
          const usersPercentChange = usersPreviousMonth !== 0 ?
            ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
            100 : 100;
        // надо будет правильно посчитать процент с прошлым месяцем
          const ordersPercentChange = ordersPreviousMonth !== 0 ?
            ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) *
            100 : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth, //в текущем месяце
            previousMonth: usersPreviousMonth,//в предыдущкм месяце
            percentChange: usersPercentChange, //процент
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  return (
    <div className="mt-[30px] min-h-screen">
   
      <div className="grid grid-cols-[65%,35%]">
       
         <div className="p-8 ">
         <UserAnalytics isDashboard={true} />  {/*теперь приборная панель*/}
        </div>  
 
    
        <div className="pt-[80px] p-8         ">
         
          <div className="w-full dark:bg-[#111C43] rounded-sm shadow   ">
            <div className="flex items-center p-7 justify-between ">
              <div className="">
                <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
             
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[16px] font-[400]">
                  Sales Obtained Всего продажи
                </h5>
              </div>
              <div className="font-Poppins dark:text-[#fff] text-black text-[14px]">
                <CircularProgressWithLabel value={
                  ordersComparePercentage?.percentChange > 0 
                  ? 100 
                  : 0
                } open={open} />
                <h5 className="text-center pt-4">
                 {
                  ordersComparePercentage?.percentChange > 0 
                  ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                  : "-" + ordersComparePercentage?.percentChange.toFixed(2)
                 } %
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111C43] rounded-sm shadow my-2  ">
            <div className="flex items-center p-7 justify-between ">
              <div className="">
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                   {/* юзеров в текущем месяце*/}
                  {userComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[16px] font-[400]">
                  New Users текущ месяце  
                </h5>
              </div>
              <div className=" font-Poppins dark:text-[#fff] text-black text-[14px]">
                <CircularProgressWithLabel 
                   value={userComparePercentage?.percentChange > 0 ? 100 : 0} 
                   open={open}
                    />
                <h5 className="text-center pt-4">
                  {userComparePercentage?.percentChange > 0
                    ? "+" + userComparePercentage?.percentChange.toFixed(2) 
                    :   userComparePercentage?.percentChange.toFixed(2)} %
                </h5>
              </div>
            </div>
          </div>

        </div>


      </div>


      <div className="grid grid-cols-[65%,35%] mt-[-20px] ">
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] 
            shadow-sm m-auto ">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5        ">
          <h5 className="dark:text-[#fff] text-black text-[20px]
           font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
