"use client";

 
import { useMeSellerQuery } from '@/redux/features/shop/shopApi';
import React from 'react'
import { useSelector } from 'react-redux'
 
import { useRouter } from 'next/navigation';

const Pageproba = () => {
const router = useRouter()

  ////const { seller  } = useAppSelector((state:any) => state.shop )
 ////////// const { user } = useSelector((state: any) => state.auth);
  //const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery(undefined, {}); 

 // console.log( '==NNNOOOOOOO=', seller  )

 //установим связь  с сервером
 /////////////////////const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery({}); 
 
 console.log( 'router=', router)
// if ( !sellerData ) { console.log( '==NNNOOOOOOO' )}
  return (
    <div>
      <div>
   {/* -----------=={seller.name}  ----  */}
      </div>
      app/pageproba/page.tsx--- прроба =  
      {/* --------------user==={user.name}--------- навигация по ссылкам nexgs */}
      ------ -------- навигация по ссылкам nexgs
      <div>
            <h1>my list of profiles</h1>
            <div>

        <ul>
          <li  onClick={() => router.push( '/pageproba/1')}> pageproba 1</li>
          <li  onClick={() => router.push( '/pageproba/2')}> pageproba 2</li>
          <li  onClick={() => router.push( '/pageproba/3')}> pageproba 3</li>
          <li  onClick={() => router.push( '/pageproba/acc')}> pageproba-acc</li>
          <li  onClick={() => router.push( '/pageproba/bcc')}> pageproba-bcc</li>
        </ul>

            </div>

      </div>
      
      
      
      
      </div>
  )
}

export default Pageproba