import React, { useState, useEffect, useContext } from "react";
import Gif from "../../Static/Img_Pred/Gif.gif";

export default function ImageComponent({ src }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{ position: "relative " }}>
      <div
        className="bg-gradient-to-tr  from-gray-800 via-gray-700 to-gray-800 w-full h-[100vh] z-50 transition-all  flex justify-center items-center "
        style={{
          display: imageLoaded ? "none" : "inline",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <div className="flex justify-center w-full h-[100vh] items-center">
          <img src={Gif} alt="" />
        </div>
      </div>
    </div>
  );
}
