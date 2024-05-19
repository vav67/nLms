//защищенный если не админ
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: React.ReactNode;
}

// export default function AdminProtected({ children }: ProtectedProps) {

//   const { user } = useSelector((state: any) => state.auth);
// //если юзер не админ возвращаем к началу
//   if (user) {
//           const isAdmin = user?.role === "admin";
//            // если аутентифицирован то продолжаем или в начало /
//     return isAdmin ? children : redirect("/");
//   }
// }

// робот заменил на
const AdminProtected: React.FC<ProtectedProps> = ({ children }: ProtectedProps) => {
  
  const { user } = useSelector((state: any) => state.auth);
  //если юзер не админ возвращаем к началу
    if (user) {
            const isAdmin = user?.role === "admin";
             // если аутентифицирован то продолжаем или в начало /
      return isAdmin ? <>{children}</> : redirect("/");
    }
    return redirect("/")
  }
export default AdminProtected 