import React, { useState } from "react";
import Home from "../../../Layout/Home";
import { Link } from "react-router-dom";
import HomeComDeBaja from "./DeBaja/HomeComDeBaja";
import HomeReversion from "./Reversion/HomeReversion";

const HomeDocDeBaja = ({ documentType }) => {
  const [selectedTab, setSelectedTab] = useState("Factura");
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      {" "}
      <Home
        children2={
          <>
            <div className=" ">
              <ul className="flex flex-wrap w-full justify-start text-lg font-medium text-gray-700 mb-4 lg:mb-0 pt-2">
                <li
                  className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                    selectedTab === "Factura"
                      ? "bg-white text-blue-500"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handleTabClick("Factura")}
                >
                  <Link
                    to=""
                    className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                  >
                    Comunicacion de Baja
                    <span
                      className={`absolute left-0 bottom-0 w-full h-0.5 bg-white transform ${
                        selectedTab === "Factura"
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      } transition-transform duration-300`}
                    ></span>
                  </Link>
                </li>
                <li
                  className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                    selectedTab === "Boleta"
                      ? "bg-white text-blue-500"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handleTabClick("Boleta")}
                >
                  <Link
                    to=""
                    className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                  >
                    Reversiones
                    <span
                      className={`absolute left-0 bottom-0 w-full h-0.5 bg-white transform ${
                        selectedTab === "Boleta"
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      } transition-transform duration-300`}
                    ></span>
                  </Link>
                </li>
              </ul>
              {selectedTab === "Factura" && (
                <>
                  {" "}
                  <HomeComDeBaja documentType={documentType} />
                </>
              )}

              {selectedTab === "Boleta" && (
                <>
                  <HomeReversion documentType={documentType} />
                </>
              )}
            </div>
          </>
        }
      />
    </>
  );
};

export default HomeDocDeBaja;
