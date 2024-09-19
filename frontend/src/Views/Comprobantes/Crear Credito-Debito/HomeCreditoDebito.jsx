import React, { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import HomeCredito from "./Credito/HomeCredito";
import HomeDebito from "./Debito/HomeDebito";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const HomeCreditoDebito = () => {
  const { tab } = useParams();
  const [selectedTab, setSelectedTab] = useState(tab || "Credito");
  useEffect(() => {
    if (tab) {
      setSelectedTab(tab);
    }
  }, [tab]);
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const [documentType, setDocumentType] = useState("Factura");

  return (
    <>
      <Home
        children2={
          <>
            <div className=" ">
              <ul className="flex flex-wrap w-full justify-start text-lg font-medium text-gray-700 mb-4 lg:mb-0 pt-2">
                <li
                  className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                    selectedTab === "Credito"
                      ? "bg-white text-blue-500"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handleTabClick("Credito")}
                >
                  <Link
                    to=""
                    className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                  >
                    Credito
                    <span
                      className={`absolute left-0 bottom-0 w-full h-0.5 bg-white transform ${
                        selectedTab === "Credito"
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      } transition-transform duration-300`}
                    ></span>
                  </Link>
                </li>
                <li
                  className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                    selectedTab === "Debito"
                      ? "bg-white text-blue-500"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handleTabClick("Debito")}
                >
                  <Link
                    to=""
                    className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                  >
                    Debito
                    <span
                      className={`absolute left-0 bottom-0 w-full h-0.5 bg-white transform ${
                        selectedTab === "Debito"
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      } transition-transform duration-300`}
                    ></span>
                  </Link>
                </li>
              </ul>
              {selectedTab === "Credito" && (
                <>
                  {" "}
                  <div className="bg-white">
                    <HomeCredito documentType={documentType} />
                  </div>
                </>
              )}

              {selectedTab === "Debito" && (
                <>
                  <div className="bg-white">
                    <HomeDebito documentType={documentType} />
                  </div>
                </>
              )}
            </div>
          </>
        }
      ></Home>
    </>
  );
};

export default HomeCreditoDebito;
