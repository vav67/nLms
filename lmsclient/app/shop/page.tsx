"use client"
import { useParams } from 'next/navigation'
import { useEffect } from 'react';
//import React from 'react'

 export default function Page () {
  //  export const PageprobaID = ( ) => {   - не реакт компонент api/v1/me
  const params = useParams()

  useEffect(() => {

    async function  vipol() {

    const data = await fetch("http://localhost:8000/test",
   {
    method:'GET',
    // headers: {
    //    Accept: 'application/json',
    //    'Content-Type': 'application/json',
    // },
 //  body: "11",   //JSON.stringify( user ),   //body: JSON.stringify(payload)   //  должен быть строкой JSON а не объектом  body: {  user,  },
   //credentials: "include", 
  }).then(res => res.json());

  console.log( '=======sst=', data.message )
}



vipol()


}, []);



  return (
    <div>
Полная страница Это просто магазин по shop ====// {params?.id}======================
       
        
        </div>
  )

}
