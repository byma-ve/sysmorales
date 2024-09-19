import React, { useState, useEffect } from "react";

import { TipoTarifarios } from "../Data/TiposTarifario";
import { Link } from "react-router-dom";
function ElegirTarifario({ seleccionarTarifa }) {
  const handleSeleccionarTarifario = (tarifario) => {
    seleccionarTarifa(tarifario);
  };

  const [busqueda, setBusqueda] = useState("");
    const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  return (
    <>
      <div className="z-10 absolute  overflow-y-auto   top-[191px] ml-2 text-left mt-1  rounded-xl shadow w-[13.8rem]  ">
        <input
          type="text"
          placeholder="Elegir Agente"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="w-full ps-4 mb-2 text-sm text-gray-600 border border-gray-300  h-10     font-semibold    bg-white hover:bg-slate-200 
          border-none rounded-xl  outline-none cursor-pointer"
        />
        <ul className="overflow-y-auto text-sm rounded-xl -mt-1 max-h-[120px] text-gray-600 bg-slate-100 ScrollTableVertical">
          {TipoTarifarios.map((tarifario, index) => (
            <li key={index} className="hover:bg-blue-300 w-full px-3 py-1">
              <div className="   rounded ">
                <div
                  onClick={() => handleSeleccionarTarifario(tarifario)}
                  className="w-full py-1 ms-2 text-sm font-medium text-gray-900 rounded cursor-pointer"
                >
                  <Link>{tarifario}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ElegirTarifario;
