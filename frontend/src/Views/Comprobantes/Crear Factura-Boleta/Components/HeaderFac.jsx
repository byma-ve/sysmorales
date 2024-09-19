import React, { useState } from "react";
import Logo from "../../../../Static/Img_Pred/LogoOscuro.webp";
const HeaderFac = ({ name, tipo }) => {
  const [serie, setSerie] = useState("001");
  const [correlativo, setCorrelativo] = useState("00003803");
  const [isEditing, setIsEditing] = useState(false);
  const [tempSerie, setTempSerie] = useState(serie);
  const [tempCorrelativo, setTempCorrelativo] = useState(correlativo);

  const handleChange = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setSerie(tempSerie);
      setCorrelativo(tempCorrelativo);
    }
  };
  return (
    <>
      <div className="grid grid-cols-[.6fr,1fr,1fr] gap-x-4 rounded-xl  pt-6 bg-white">
        <div className="flex p-4">
          <div className=" content-center w-fullflex justify-center ">
            <img src={Logo} alt="" className="h-24" />
          </div>
        </div>{" "}
        <div className="content-center">
          <h1 className="text-xl font-semibold">
            Byma-ve Innovation
          </h1>
          <p>CAL.LAS LIMAS NRO. 421 URB. NARANJAL</p>
          <p>LIMA - LIMA - LOS OLIVOS</p>
        </div>
        <div className="mt-5 ">
          <div className="text-center grid  space-y-1 border rounded-xl border-black  mx-8 p-3 ">
            <p className="text-gray-700">RUC: 20610314644</p>
            <h1 className="text-2xl font-bold uppercase">{name} ELECTRONICA</h1>
            {isEditing ? (
              <div className="flex justify-center items-center space-x-2">
                <input
                  className="border border-gray-300 px-2  w-16 text-center"
                  value={tempSerie}
                  onChange={(e) => setTempSerie(e.target.value)}
                />
                <span>-</span>
                <input
                  className="border border-gray-300 px-2  w-24 text-center"
                  value={tempCorrelativo}
                  onChange={(e) => setTempCorrelativo(e.target.value)}
                />
                <button
                  className="underline text-blue-500"
                  onClick={handleChange}
                >
                  {isEditing ? "(Guardar)" : "(Cambiar)"}
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center space-x-2">
                <p className="italic text-gray-500">
                  Nro. {tipo}
                  {serie}-{correlativo}
                </p>
                <button
                  className="underline text-blue-500"
                  onClick={handleChange}
                >
                  {isEditing ? "(Guardar)" : "(Cambiar)"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderFac;
