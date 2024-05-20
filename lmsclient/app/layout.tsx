 "use client";
// удалено ч2 01-47-43  import type { Metadata } from "next";
//удалено import { Inter } from "next/font/google";
 
import "./globals.css";
  import { Poppins } from "next/font/google";
  import { Josefin_Sans } from "next/font/google";

//импортируем нашу тему
import { ThemeProvider } from "./utils/theme-provider";
 import { Toaster } from "react-hot-toast";

  import { Providers } from "./Provider"; // ч2 01-47-43 подключил
  import { SessionProvider } from "next-auth/react";
  import React, { FC, useEffect, useState } from "react";
  
   import { useLoadUserQuery, useRefreshTokenQuery } from "@/redux/features/api/apiSlice";
  import Loader from "./components/Loader/Loader";
 
  import socketIO from "socket.io-client";
  const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
  const socketId = socketIO(ENDPOINT, { transports: ["websocket"] }); //индетификатор сокета


//добавили шрифты (использ они в tailwind.config.ts)
  const poppins = Poppins({
   subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins",
  });

  const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
   variable: "--font-Josefin",
  });

//глобальный макет для страниц

export default function RootLayout({
   children, 
  }:{ children: React.ReactNode
  }) {
  return (
    <html lang="en"           
    suppressHydrationWarning={true}
    >
     <body className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat 
       dark:bg-gradient-to-b  dark:from-gray-900 dark:to-black duration-300`
      }>   
      

      <Providers>  {/* подключили store*/}
 
 {/* Этот провайдер контекста позволяет вашему приложению получить 
    доступ к данным сессии из любого места вашего приложения,  не 
 передавая их как пропсы  => const { data: session } = useSession(); */}
              <SessionProvider> 
 {/* наша тема  */}
  
 <ThemeProvider attribute= 'class'  defaultTheme="light"  > 
      {/*    attribute= '  class  '  defaultTheme='system' enableSystem   > */}
   
 <Custom>{children}</Custom>    
  {/* <Custom><div>{children}</div> </Custom>      */}
               {/* {children}   */}
         
            <Toaster position="top-center" reverseOrder={false} />     
             
             </ThemeProvider>  
          </SessionProvider > 
          </Providers>    
        
       </body>
    </html>
  ) 
}
 
  const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
    
  // пока нет  const {   isLoading  } = useLoadUserQuery({});
  
   

     useEffect(() => {
 
       socketId.on("connection", () => {}) //подключаемся
     }, []);

 


 // console.log(  '======== итак children='  )   

    // return ( 
    //   <>{isLoading ? <Loader /> : <div>{children}</div>}</> 
    // )
    return ( 
      <>{  <div>{children}</div>}</> 
    )
  } 

 /**
   * 
  * Чтобы отобразить индикатор загрузки для фоновой загрузки, вы можете
  *  посмотреть значение, isFetching перенастроенное из useQuery, 
  * которое будет true всякий раз, когда происходит какая-либо выборка,
  *  независимо от того, первая это выборка или повторная выборка. 
  * Вы также можете использовать isRefetching только проверку наличия 
  * повторных выборок.
    */