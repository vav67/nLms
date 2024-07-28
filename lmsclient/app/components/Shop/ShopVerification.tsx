import { styles } from "@/app/styles/style";
// import { useActivationMutation } from "@/redux/features/auth/authApi";
import { useActivationshopMutation } from "@/redux/features/shop/shopApi";
import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
  import { VscWorkspaceTrusted } from "react-icons/vsc";
  import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
};
//чеиыре цифры  ОТП кодов
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

//========================




const ShopVerification:FC<Props> = ({ setRoute }) => {
 
    const { user } = useSelector((state: any) => state.auth);
const { activationTokenShop } = useSelector((state: any) => state.shop); 

// нужна функция активации  
///и  в нее передаем  токен activation_token,  и   код активации activation_code,   
   const [activation, { isSuccess, error }] = useActivationshopMutation();
   
  //переменные состояния
  const [invalidError, setInvalidError] = useState<boolean>(false);

 
  useEffect(() => {
   // когда выполнился  useActivationMutation() , то будет результа,
   // который проверим
    if (isSuccess) { //удачный
      toast.success("Account activated successfully");
      setRoute("Shop-login");//и выше передаем к экрану входа
    }
    if (error) { // ошибка
      if ("data" in error) {
        const errorData = error as any;
        //сообщение об ошибке
        toast.error(errorData.data.message);
        setInvalidError(true);//присваиваем истину 
      } else {
        console.log("An error occured произошла ошибка:", error);
      }
    }
  }, [isSuccess, error]);
 
//представление значение будет нулевым ???????? 01-27-52
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  //проверить номер внутри 01-29-35
  //переменные состояния
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });




  // нажатие на кнопку верификации
  const verificationHandler = async () => {
  //  console.log( 'test')
  //собираем в строку
  const verificationNumber = Object.values(verifyNumber).join("");

    if (verificationNumber.length !== 4) {
   //если не равна четырем   
       setInvalidError(true); //ошибка
     return;
   }
   // тогда передаем токен и код на выполнение
   // и еще юзера
   // также добавляю имя юзера и почту
//newForm.append("username",  username )
//newForm.append("useremail", useremail )
         await activation({
       activation_token_shop: activationTokenShop,
       activation_code_shop: verificationNumber,
       activation_user_email: user.email
             });
   };

  // //!pengirim data
//обработать изменение ввода 01-28-38
  const handleInputChange = (index: number, value: string) => {
   setInvalidError(false); //установим вначале ошибка ложь
//cам
//let ss 
  //if (value.length > 1) { ss= value.slice(0, 1) }
 // console.log( 'ss=', ss)
//----------
 //присваиваем объект в котором изменяем поле с индексом
   const newVerifyNumber = { ...verifyNumber, [index]: value };
   //присваиваем
    setVerifyNumber(newVerifyNumber);
    //проверка где фокусируемся на HTMLInputElement
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
   // } else if (value.length === 1 && index < 3) { сам измен на
  } else if (value.length === 1 && index < 3) {
      //длина значения и входные повторы
      inputRefs[index + 1].current?.focus();
    }  //сам добавил
    else { 
      value = ''
      inputRefs[0].current?.focus(); }   //сам добавил
  };


// -------------------сам
const handleChange = (value: string, index:any)  => {

  let newValue = value   // e.target.value;
    
  // Проверяем, содержит ли текущее значение более одной цифры
  if (newValue.length > 1) {
    // Если содержит, обрезаем его до одной цифры
    newValue = newValue.substring(newValue.length - 1);
  }
  // Проверяем, является ли newValue числом от 0 до 9
  if (/^[0-9]+$/.test(newValue)) {
    // Если да, передаем новое значение в функцию handleInputChange()
    handleInputChange(index, newValue);
    } 

 
};


//----------------------------

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account Подтвердите ваш аккоунт </h1>
      <br />
 <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>  
      <br />

      <br />
      <div  //  className="1100px:w-[70%] m-auto flex items-center justify-around
       className="  m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
             type= "number"
            maxLength = {1}
           //  min = "0"
           //  max ="9 "
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] 
            flex items-center text-black dark:text-white invalidError justify-center
             text-[18px] font-Poppins online-none text-center ${
              invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#0000004a)"
            }` }  //c анимацией shake в глобальном css
            placeholder=""
      
              value={verifyNumber[key as keyof VerifyNumber]}
            //onChange={(e) => handleInputChange(index, e.target.value)}
           //сам onChange={(e) => handleInputChange(index, e.target.value.substring(e.target.value.length - 1))}        
           onChange={(e) => handleChange(e.target.value, index)} //сам теперь по кругу и по одной цифре
          />
        ))}
      </div> 
      <br />
     
      <br />
      <div className="w-full flex justify-center">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          {" "}
          Verify OTP
        </button>
      </div>  
      <br />
    <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?{" "}
        <span
          className="text-[#2190ff] pl-1 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </h5>  
    </div>
  );
};

export default ShopVerification;
