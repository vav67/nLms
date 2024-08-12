"use client"
import { useParams } from 'next/navigation'
//import React from 'react'

 export default function PageprobaID()  {
  //  export const PageprobaID = ( ) => {   - не реакт компонент
 const params = useParams()

  return (
    <div>
ljkjljl
        page {params?.id}
        
        </div>
  )
}
