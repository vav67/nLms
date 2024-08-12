  import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
 import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  //состояния
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const[ profilepage, setProfilepage] = useState(false) //это не профайл пэйдж
  const [pagedatauser, setPagedatauser] = useState(null);

  //когда пользователь не аутентифицирован
 //получим о курсе
  const { data, isLoading } = useGetCourseDetailsQuery(id);
 //наш публичный ключ
   const { data: config } = useGetStripePublishablekeyQuery({});
//платеж
const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();
    //юзер
  const { data: userData } = useLoadUserQuery(undefined, {});

  //cостояния
   const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState(""  );

  useEffect(() => {
    if (config) { //есть публичный ключ
      const publishablekey = config?.publishablekey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data && userData?.user) { //данные о курсе и юзер
      const amount = Math.round(data.course.price * 100);
      // отправка платежа
      createPaymentIntent(amount);
    }
  }, [config, data, userData]);

  useEffect(() => {
    if (paymentIntentData) { // результат платежа
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
       {isLoading ? (  //загрузка деталей курса
        <Loader />
      ) : (  
        <div>
           <Heading //это для SEO
            title={data?.course?.name + " - ELearning"}
            description={
              "ELearning is a programming community which is developed by shahriar sajeeb for helping programmers"
            }
            keywords={data?.course?.tags}  //ключевые слова
          />  
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}

            profilepage = {profilepage}
            userData ={pagedatauser}
            //refetch={refetch}

          />
          {stripePromise && (  // если есть
            <CourseDetails
              data={data.course}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setRoute={setRoute}
              setOpen={setOpen}
            />
            )}  
          <Footer />
        </div>
      )}  
    </>
  );
};

export default CourseDetailsPage;
