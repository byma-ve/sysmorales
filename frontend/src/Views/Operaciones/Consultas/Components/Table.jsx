import React from "react";

import { IconoHamburguesa } from "../../../../Iconos/Iconos-NavBar";
const Table = ({ informacionInstancia }) => {
  return (
    <div className="">
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="    text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody className="text-left text-[#535c69] whitespace-nowrap block">
            <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
              <tr>
                <td className=""></td>
                <td className=" px-8 py-3  ">Instancias</td>
                <td className="  px-8 py-3 ">Estado Mercancia</td>
                <td className="  px-8 py-3  ">Fecha Estado</td>
                <td className="  px-8 py-3  ">Comentario</td>
                <td className=" px-8 py-3    "> Imagen</td>
              </tr>
            </thead>

            <tr className="border-b bg-white  border-gray-300 hover:bg-gray-300 ">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 ">
                <button className="text-[#535c69]">
                  <IconoHamburguesa />
                </button>
              </th>
              <td className="px-8 py-4 w-1/6 ">
                {" "}
                {informacionInstancia.instancia
                  ? informacionInstancia.instancia.toUpperCase()
                  : ""}
              </td>
              <td className="px-8 py-4 w-1/6">
                {informacionInstancia.estado_mercancia
                  ? informacionInstancia.estado_mercancia.toUpperCase()
                  : ""}
              </td>
              <td className="px-8 py-4 w-1/6">
                {informacionInstancia.fecha_estado
                  ? informacionInstancia.fecha_estado
                  : ""}
              </td>
              <td className="px-8 py-4 w-1/6">
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
                {informacionInstancia?.imagen_4 && (
                  <>
                    <a href={informacionInstancia.imagen_4} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_5 && (
                  <>
                    <a href={informacionInstancia.imagen_5} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
                {informacionInstancia?.imagen_6 && (
                  <>
                    <a href={informacionInstancia.imagen_6} target="_blank">
                      <IconoOjito2 className="mx-1" />
                    </a>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
