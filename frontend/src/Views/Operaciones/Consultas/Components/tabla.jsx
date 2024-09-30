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
            {/* Instancia 1 En Registro*/}
            {informacionInstancia?.Registro && (
              <tr className="items-center align-middle py-4">
                <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                  {informacionInstancia?.Registro.comentario && (
                    <>
                      <button>
                        <ModalComentario
                          dato={informacionInstancia.Registro.comentario.toUpperCase()}
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Registro.instancia
                    ? informacionInstancia.Registro.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {informacionInstancia.Registro.estado_mercancia
                    ? informacionInstancia.Registro.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Registro.fecha_estado
                    ? informacionInstancia.Registro.fecha_estado
                    : ""}
                </td>
                <td className="px-4 py-3 flex "></td>
                <td className="px-4 py-3 "></td>
              </tr>
            )}

            {/* Instancia 2  En Despacho*/}
            {informacionInstancia?.Despacho && (
              <tr className="items-center align-middle py-4">
                <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                  {informacionInstancia?.Despacho.comentario && (
                    <>
                      <button>
                        <ModalComentario
                          dato={informacionInstancia.Despacho.comentario.toUpperCase()}
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Despacho.instancia
                    ? informacionInstancia.Despacho.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {informacionInstancia.Despacho.estado_mercancia
                    ? informacionInstancia.Despacho.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Despacho.fecha_estado
                    ? informacionInstancia.Despacho.fecha_estado
                    : ""}
                </td>
                <td className="px-4 py-3 flex ">
                </td>
                <td className="px-4 py-3 ">
                </td>
              </tr>
            )}

            {/* Instancia 3 Intento 1*/}
            {informacionInstancia?.Intento1 && (
              <tr className="items-center align-middle py-4">
                <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                  {informacionInstancia?.Intento1.comentario && (
                    <>
                      <button>
                        <ModalComentario
                          dato={informacionInstancia.Intento1.comentario.toUpperCase()}
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento1.instancia
                    ? informacionInstancia.Intento1.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {informacionInstancia.Intento1.estado_mercancia
                    ? informacionInstancia.Intento1.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento1.fecha_estado
                    ? informacionInstancia.Intento1.fecha_estado
                    : ""}
                </td>
                <td className="px-4 py-3 flex ">
                  {" "}
                  {(informacionInstancia?.Intento1.imagen_1 ||
                    informacionInstancia?.Intento1.imagen_2 ||
                    informacionInstancia?.Intento1.imagen_3) && (
                    <ModalImagenes datos={informacionInstancia.Intento1} />
                  )}
                </td>
                <td className="px-4 py-3 ">
                  {(informacionInstancia?.Intento1.imagen_4 ||
                    informacionInstancia?.Intento1.imagen_5 ||
                    informacionInstancia?.Intento1.imagen_6) && (
                    <ModalCargos datos={informacionInstancia.Intento1} />
                  )}
                </td>
              </tr>
            )}

            {/* Instancia 4 Intento 2*/}
            {informacionInstancia?.Intento2 && (
              <tr className="items-center align-middle py-4">
                <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                  {informacionInstancia?.Intento2.comentario && (
                    <>
                      <button>
                        <ModalComentario
                          dato={informacionInstancia.Intento2.comentario.toUpperCase()}
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento2.instancia
                    ? informacionInstancia.Intento2.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {informacionInstancia.Intento2.estado_mercancia
                    ? informacionInstancia.Intento2.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento2.fecha_estado
                    ? informacionInstancia.Intento2.fecha_estado
                    : ""}
                </td>
                <td className="px-4 py-3 flex ">
                  {" "}
                  {(informacionInstancia?.Intento2.imagen_1 ||
                    informacionInstancia?.Intento2.imagen_2 ||
                    informacionInstancia?.Intento2.imagen_3) && (
                    <ModalImagenes datos={informacionInstancia.Intento2} />
                  )}
                </td>
                <td className="px-4 py-3 ">
                  {(informacionInstancia?.Intento2.imagen_4 ||
                    informacionInstancia?.Intento2.imagen_5 ||
                    informacionInstancia?.Intento2.imagen_6) && (
                    <ModalCargos datos={informacionInstancia.Intento2} />
                  )}
                </td>
              </tr>
            )}

            {/* Instancia 5 Intento 3*/}
            {informacionInstancia?.Intento3 && (
              <tr className="items-center align-middle py-4">
                <td className=" py-3 align-midle px-8 w-[2%] text-center ">
                  {informacionInstancia?.Intento3.comentario && (
                    <>
                      <button>
                        <ModalComentario
                          dato={informacionInstancia.Intento3.comentario.toUpperCase()}
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento3.instancia
                    ? informacionInstancia.Intento3.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {informacionInstancia.Intento3.estado_mercancia
                    ? informacionInstancia.Intento3.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-4 py-3">
                  {informacionInstancia.Intento3.fecha_estado
                    ? informacionInstancia.Intento3.fecha_estado
                    : ""}
                </td>
                <td className="px-4 py-3 flex ">
                  {" "}
                  {(informacionInstancia?.Intento3.imagen_1 ||
                    informacionInstancia?.Intento3.imagen_2 ||
                    informacionInstancia?.Intento3.imagen_3) && (
                    <ModalImagenes datos={informacionInstancia.Intento3} />
                  )}
                </td>
                <td className="px-4 py-3 ">
                  {(informacionInstancia?.Intento3.imagen_4 ||
                    informacionInstancia?.Intento3.imagen_5 ||
                    informacionInstancia?.Intento3.imagen_6) && (
                    <ModalCargos datos={informacionInstancia.Intento3} />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabla;
