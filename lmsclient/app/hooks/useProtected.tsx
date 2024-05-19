 // защита если не аутентифицирован 
import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";

interface ProtectedProps {
       children: React.ReactNode;
}

// export default function Protected( { children }: ProtectedProps ): React.ReactNode
//  {
//  // хук проверки пользователя 
//   const isAuthenticated = userAuth();
//  // если аутентифицирован то продолжаем или в начало /
//   return (
//     isAuthenticated ? children : redirect("/")
//   )
// }
// робот заменил на
const Protected: React.FC<ProtectedProps> = ({ children }: ProtectedProps) => {
  
  // хук проверки пользователя 
  const isAuthenticated = userAuth();
  // если аутентифицирован то продолжаем или в начало /
  return isAuthenticated ? <>{children}</> : redirect("/");
}

export default Protected;
 




