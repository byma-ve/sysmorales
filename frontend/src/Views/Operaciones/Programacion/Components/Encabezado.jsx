import { useState, useEffect } from "react";
import { IconoPencil } from "../../../../Iconos/Iconos-NavBar";
import { IconoCerrar } from "../../../../Iconos/Iconos-NavBar";

function Encabezado({
  title,
  onSubmit,
  setClickEditar,
  programacionSeleccionada,
  setIsButtonDisabled,
  handleEliminarProgramacion,
}) {
  return (
    <>
      <div className="-mt-[8px] w-full ">
        <div className="text-white flex items-center  justify-between bg-var(--gris) mb-3">
          <h1 className="text-3xl pr-5 font-semibold">{title}</h1>

          <div className="botones flex ">
            <button
              className={`px-[10px]   p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl mr-3  ${
                !(programacionSeleccionada && programacionSeleccionada)
                  ? "cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                setClickEditar(true);
                setIsButtonDisabled(true);
              }}
              disabled={!programacionSeleccionada}
            >
              <IconoPencil />
            </button>
            <button
              onClick={() =>
                handleEliminarProgramacion(programacionSeleccionada)
              }
              disabled={!programacionSeleccionada}
              className={`px-[10px]   p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl mr-3  ${
                !(programacionSeleccionada && programacionSeleccionada)
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <IconoCerrar />
            </button>
            <button
              onClick={onSubmit}
              className="bg-gradient-to-t from-blue-400 h-10 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
              px-8 tracking-wide text-[18px] font-semibold  rounded-[10px]   ml-4"
            >
              <h1>Programar</h1>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Encabezado;
