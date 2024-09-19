import React, { useState } from "react";
import { IconoComentario, IconoPDF } from "../../../../Iconos/Iconos-NavBar";

import ModalComentario from "../Modals/ModalComentario";
import ModalImagenes from "../Modals/ModalImagenes";
import ModalCargos from "../Modals/ModalCargos";
const Tabla = ({ informacionInstancia }) => {
  const [open, setOpen] = useState(false);
  const OpenModal = () => {
    setOpen(!open);
    console.log("open", open);
  };

  return (
    <div className="mt-4 ">
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-2xl ">
        <table className="w-full bg-white ">
          <thead className="font-medium text-sm bg-blue-400   rounded-t-xl text-gray-600">
            <tr className=" text-white uppercase rounded-xl">
              <th className="py-2 align-top w-[2%] text-start">
                <h1></h1>
              </th>
              <th className="px-4 py-2 align-top w-1/6 text-start">
                Instancias
              </th>
              <th className="px-4 py-2 align-top w-1/6 text-start">
                Estado Mercancia
              </th>
              <th className="px-4 py-2 align-top w-1/6 text-start">
                Fecha Estado
              </th>
              <th className="px-4 py-2 align-top w-1/6 text-start">Imagenes</th>
              <th className="px-4 py-2 align-top w-1/6 text-start">Cargos</th>
            </tr>
          </thead>
          <tbody>
            <tr className="items-center align-middle py-4">
              <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                {informacionInstancia?.comentario && (
                  <>
                    <button>
                      <ModalComentario
                        dato={informacionInstancia.comentario.toUpperCase()}
                      />
                    </button>
                  </>
                )}
              </td>
              <td className="px-4 py-3">
                {informacionInstancia.instancia
                  ? informacionInstancia.instancia.toUpperCase()
                  : ""}
              </td>
              <td className="px-4 py-3">
                {" "}
                {informacionInstancia.estado_mercancia
                  ? informacionInstancia.estado_mercancia.toUpperCase()
                  : ""}
              </td>
              <td className="px-4 py-3">
                {informacionInstancia.fecha_estado
                  ? informacionInstancia.fecha_estado
                  : ""}
              </td>
              <td className="px-4 py-3 flex ">
                {" "}
                {(informacionInstancia?.imagen_1 ||
                  informacionInstancia?.imagen_2 ||
                  informacionInstancia?.imagen_3) && (
                  <ModalImagenes datos={informacionInstancia} />
                )}
              </td>
              <td className="px-4 py-3 ">
                {(informacionInstancia?.imagen_4 ||
                  informacionInstancia?.imagen_5 ||
                  informacionInstancia?.imagen_6) && (
                  <ModalCargos datos={informacionInstancia} />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabla;
