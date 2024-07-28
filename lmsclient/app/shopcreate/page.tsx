"use client";
import React, { FC, useEffect, useState } from "react";

import ShopCreate from "../components/Shop/ShopCreate";
import CustomModal from "../utils/CustomModal";
import ShopLogin from "../components/Shop/ShopLogin";
import ShopVerification from "../components/Shop/ShopVerification";
//import ShopCreateto from "../components/Shop/ShopCreateto";

 
type Props = {};

const page: FC<Props> = (props) => {

//начальная страница магазина
  //начальное состояния (переменные)  
  const [open, setOpen] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState(0);
  //начальное значение чтоб войти в систему
  //const [route, setRoute] = useState("Login");
  const [route, setRoute] = useState("Verification");

  return (
    <>
    <div> СТРАНИЦА page----------shopcreate лучше на страницу раньше , где клиент</div>
  {/* <ShopCreate 
  //передаем начальное состояние
  open={open}
  setOpen={setOpen}
  activeItem={activeItem}
 setRoute={setRoute}
   route={route}
  
  />  
  
здесь через модал открываем три разных окна  
  */}

{route === "Sign-Up" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopCreate}
           //  refetch={refetch}
            />
          )}  
          </>
        )}



{route === "Login" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopLogin}
           //  refetch={refetch}
            />
          )}  
          </>
        )}

{route === "Verification" && (
        <>
         {open && (
 <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={ShopVerification }
           //  refetch={refetch}
            />
          )}  
          </>
        )}


    {/* <ShopCreateto /> */}
</>
  )
}

export default page