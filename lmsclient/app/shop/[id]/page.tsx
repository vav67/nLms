"use client"
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useMeSellerQuery } from '@/redux/features/shop/shopApi';
import { useParams } from 'next/navigation'
//import React from 'react'

 export default function Page()  {
  //  export const PageprobaID = ( ) => {   - не реакт компонент
 
 const params = useParams()
 console.log( 'params=', params)
 
 const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery({}); 
 const {data:userData ,isLoading:isLoadinguser,  refetch} = useLoadUserQuery(undefined, {}); 






 
  return (
    <div>
магазинчик ------------
        page {params?.id}
        
        </div>
  )
}
