"use client";
import React, { FC, useEffect, useState } from "react";
 import { useFormik } from "formik";
  import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
 import { FcGoogle } from "react-icons/fc";
   import { styles } from "../../styles/style";
 import { useLoginMutation } from "@/redux/features/auth/authApi";
  import toast from "react-hot-toast";
   import { signIn } from "next-auth/react";

type Props = {
  setRoute: (route: string) => void; // переход
  setOpen: (open: boolean) => void; // окно входа
  refetch:any;
};

const schema = Yup.object().shape({
  email: Yup.string()
                 .email("Invalid email!")
                .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

//=================

const Login: FC<Props> = ({ setRoute, setOpen, refetch  }) => {
  
  //переменные состояния
  const [show, setShow] = useState(false);
  
  //получаем ответ от запроса -авторизовываемся
   const [login, { isSuccess, error }] = useLoginMutation();

  //после нажатия  отправим введенные данные
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
     onSubmit: async ({ email, password }) => {
   //////  console.log({ email, password })
    await login({ email, password });//--- отправляем запрос на useLoginMutation
      },
  });
 
 //запишем результат
  useEffect(() => {
    if (isSuccess) {
   //данные получены от useRegisterMutation     
      toast.success("Login Successfully!");
      setOpen(false); //закроем окно входа - передает выше
      refetch();
    }
    if (error) { //если ошибка
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);
 

 const { errors, touched, values, handleChange, handleSubmit } = formik;

  //=================

  return (
    
     
        <div className="min-h-screen bg-gray-50 ">


       <h1 className={`${styles.title}`}>Login with ELearning</h1>{" "} 
    
     <form onSubmit={handleSubmit}>
        <label className={`${styles.label}`} htmlFor="email">
          Enter your Email
        </label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />  
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}  

        <div className="w-full mt-5 relative mb-1">
           <label className={`${styles.label}`} htmlFor="password">
            Enter your password
          </label>  
        <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`} 
          />  
            {!show ? (
            <AiOutlineEyeInvisible
             fill=  "orange"    //цвет иконки white black
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
           fill= "orange"                   
              className="absolute bottom-3 right-2 z-1 cursor-pointer  "
              size={20}
              onClick={() => setShow(false)}
            />
          )}  
        
        </div>

       {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>  
        <br />

          <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>    
       <div className="flex items-center justify-center my-3">
    <FcGoogle size={30} className="cursor-pointer mr-2"
            onClick={() => signIn("google")}
          />
    <AiFillGithub  className="cursor-pointer ml-2" size={30} fill="grey" //цвет иконки
            onClick={() => signIn("github")}
          />
        </div>  
               <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Not have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
   onClick={() => setRoute("Sign-Up")} //передает выше в Header и выше в page.tsx
          >
            Sign up
          </span>
        </h5>  
      </form>
      <br />
    </div>
    
     
  );
};

export default Login;
