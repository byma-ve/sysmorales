import React from "react";
import { Opciones } from "../../Cliente/Data/Opciones";

function OpConfiguracion() {
  return (
    <>
      <div className="z-10 absolute bg-white rounded-lg shadow w-60 top-full">
        <ul className="p-3 overflow-y-auto text-sm text-gray-200">
          {Opciones.map((opcion, index) => (
            <li key={index}>
              <div className="flex items-center ps-2 rounded hover:bg-gray-200">
                <label className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded cursor-pointer">
                  {opcion}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default OpConfiguracion;
