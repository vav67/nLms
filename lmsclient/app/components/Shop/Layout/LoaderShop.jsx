import React from "react";
 // устарело import Lottie from "react-lottie";
 import Lottie from "lottie-react";
//анимация
//import animationData from "../../Assests/animations/24151-ecommerce-animation.json";
  //import animationData from "/lmsclient/public/animation/Animation - 1699363491256.json"
  import animationData from "../../../../public/animation/Animation - 1699363491256.json"
    
 
             
 const LoaderShop = () => {
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };
  return (
    <div className="w-full h-screen flex items-center justify-center">
     
       {/* <Lottie options={defaultOptions} width={300} height={300} />   */}
       <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LoaderShop;