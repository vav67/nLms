/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
   //   domains:['res.cloudinary.com','randomuser.me'],
   remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '**',
    },
     
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
      
      {
        protocol: 'https',
        hostname: 'lmsserver-three.vercel.app',
        pathname: '**',
      },     
  ],
    }, 

  //     experimental:{
  //   ////    reactRoot: true,
  //   ////    suppressHydrationWarning: true,
  //   missingSuspenseWithCSRBailout: false, //https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  // },
 
  // async headers() {
  //   return [
  //     {
  //   // matching all API routes-https://vercel.com/guides/how-to-enable-cors#enabling-cors-using-vercel.json
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // },




  }


export default nextConfig;
//module.exports = nextConfig
