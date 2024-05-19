import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
 import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
 const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  data: any;
 user:any;
       refetch:any;
};
           
const CheckOutForm = ({ setOpen, data, refetch, user   }: Props) => {
  console.log("CheckOutForm ")
  //состояние
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  
  // юзер
  // const [loadUser, setLoadUser]  = useState(false)
  // const {} = useLoadUserQuery({skip:loadUser ? false : true});
  
  //віполнение загрузки
   const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);// статус обработки платежа
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", //перенапрвление
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);     //статус обработки платежа
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false); // статус обработки платежа
      //создание заказа
      createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
  };

     //ордер создан
   useEffect(() => {
    if(orderData){
    //  setLoadUser(true)
    refetch();
    // отправим оповещение
    socketId.emit("notification", {
       title: "New Order",
       message: `You have a new order from ${data.name}`,
       userId: user._id,
     });
    //перенаправим на доступ к курсу
     redirect(`/course-access/${data._id}`);
    }
    if(error){ //если ошибка
    if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
   }, [orderData,error])
  

  return (// из примера возьмем форму отправления заказа
 // https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/client/react-cra/src/CheckoutForm.js
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ? "Paying..." : "Pay now"}  {/* статус обработки платежа */}
        </span>
      </button>  
      {/* Show any error or success messages */}
           {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>
      )}  
    </form>
  );
};

export default CheckOutForm;
