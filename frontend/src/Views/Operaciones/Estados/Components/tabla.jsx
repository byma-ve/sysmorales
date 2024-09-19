import React, { useState } from "react";
import {
  IconoComentario,
  IconoPDF,
  IconoOjito2,
} from "../../../../Iconos/Iconos-NavBar";
import ModalComentario from "../Modals/ModalComentario";
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
              <th className="px-4 py-2 align-top w-1/6 text-start">Imagen</th>
              <th className="px-4 py-2 align-top w-1/6 text-start">Cargo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="items-center align-middle py-4">
              <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                <button onClick={OpenModal}>
                  <IconoComentario />
                </button>
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
              <td className="px-4 py-3 flex gap-x-6 ">
                {" "}
                {/* {informacionInstancia.comentario
                    ? informacionInstancia.comentario.toUpperCase()
                    : ""} */}{" "}
                {informacionInstancia?.imagen_1 && (
                  <>
                    <a href={informacionInstancia.imagen_1} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_2 && (
                  <>
                    <a href={informacionInstancia.imagen_2} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_3 && (
                  <>
                    <a href={informacionInstancia.imagen_3} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
                
              </td>
              <td className="px-4 py-3 ">
                {informacionInstancia?.imagen_4 && (
                  <>
                    <a href={informacionInstancia.imagen_4} target="_blank">
                      <IconoPDF className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_5 && (
                  <>
                    <a href={informacionInstancia.imagen_5} target="_blank">
                      <IconoPDF className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_6 && (
                  <>
                    <a href={informacionInstancia.imagen_6} target="_blank">
                      <IconoPDF className="mx-1" />
                    </a>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ModalComentario open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tabla;
