// pages/shop/[id].tsx
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { GetServerSideProps } from 'next';



export default function ShopPage({      // sellerData, 
  userData 

}:any ) {
  // if (!sellerData || !userData) {
    if (  !userData) {
    return <div>404 - Страница не найдена</div>;
  }

  return (
    <div>
      Магазинчик page  {/*{sellerData?.id} */}
    </div>
  );
}

export const generateStaticParams  = async (context:any ) => {
 // const { id } = context.params;
 // const params = useParams()
 console.log( '==========context=', context)
  // Пример запросов к API
 // const sellerData = ''// await fetch(`https://api.example.com/seller/${id}`).then(res => res.json());
 // const userData = await fetch(process.env.NEXT_PUBLIC_SERVER_URI + "user").then(res => res.json());
 const {data:userData , isLoading:isLoadinguser,  refetch} = useLoadUserQuery(undefined, {}); 
 
// const { data: sellerData, isLoading, error:sellererror } =  useMeSellerQuery({}); 

//  if (!sellerData || !userData) {
  if ( !userData) {  
return {
      notFound: true,
    };
  }

  return {
    props: {
   //   sellerData,
      userData,
    },
  };
};
