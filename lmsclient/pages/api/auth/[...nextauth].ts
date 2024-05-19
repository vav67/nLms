//это динамический-маршрут NextAuth.js для аутентификации. 
// Он используется для обработки запросов аутентификации
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

//console.log( '====[...nextauth].ts===============',process.env.GOOGLE_CLIENT_ID,'red');

// опции
export const authOptions = {
  //провайдеры массив
  providers: [
    // отправка индитиф-р и секрет клиента или пустая строка
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
//сам это в C:\Users\qq\youtube-fullstack-Nextjs13proect
// CredentialsProvider({    id: "credentials",    name: "Credentials",
// credentials: {
 
//  email: { label: 'email', type: 'email', required: true }, // поле обязательно
//  password: { label: 'password', type: 'password', required: true }, // поле обязательно
// },


  ],
  // секрет пароль
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
