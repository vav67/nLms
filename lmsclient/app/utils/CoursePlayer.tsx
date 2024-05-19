import React, { FC, useEffect, useState } from "react";
 import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  //состояние видеоданных
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

//console.log( 'videoUrl =', videoUrl )

  //эффект использования
  useEffect(() => {
  axios
    .post("http://localhost:8000/api/v1/getVdoCipherOTP", {
  // .post(`${ process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP `, {  
        videoId: videoUrl, //адрес нашего видео
      })
      .then((res) => { //получаем ответ
        setVideoData(res.data);
      });
  }, [videoUrl]);

 

// где player=yIwFmrpgM7dQHtoe индетификатор игрока 
// находиться в Custom Player https://www.vdocipher.com/dashboard/config/customplayer
//в итоге зашифрованные носители
  return (
    <div style={{  position: "relative", paddingTop: "41%" }}>
    
  {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
 src={`https:/player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=yIwFmrpgM7dQHtoe`}
          style={{
            border: 0,
            width: "90%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}  
    </div>
  );
};
export default CoursePlayer;
