import React, { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import { useParams } from "react-router-dom";
import HomeFactura from "./Factura/HomeFactura";
import HomeBoleta from "./Boleta/HomeBoleta";
import { Link } from "react-router-dom";
const HomeFacturaBoleta = () => {
  const { tab } = useParams();
  const [selectedTab, setSelectedTab] = useState(tab || "Factura");
  useEffect(() => {
    if (tab) {
      setSelectedTab(tab);
    }
  }, [tab]);
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
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
                    Factura
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
                    Boleta
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
                  <HomeFactura />
                </>
              )}

              {selectedTab === "Boleta" && (
                <>
                  {" "}
                  <HomeBoleta />
                </>
              )}
            </div>
          </>
        }
      ></Home>
    </>
  );
};

export default HomeFacturaBoleta;
