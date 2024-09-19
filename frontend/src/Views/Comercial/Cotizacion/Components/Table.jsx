import React, { useState, useEffect } from "react";
import { IconoHamburguesa, Imprimir } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";
import { printPDF } from "./GeneradorPDF";

import "jspdf-autotable";
function Table({
  handleEnviarValidacion,
  handleEliminarCotizacion,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  cotizacionesActuales,
  cotizacionesFiltrados,
  mostrarModal,
  handleIconHover,
  handleIconHoverExit,
  showModal,
  selectedRow,
  columnasVisibles,
}) {
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (registroSeleccionado != null) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Comercial/Cotizacion/imprimirPdf.php?id_cotizacion=${registroSeleccionado}`
      )
        .then((response) => response.json())
        .then((data) => {
          printPDF(data);
          setRegistroSeleccionado(null);
          setTrigger(false);
        })
        .catch((error) => console.error("Error al obtener los datos:", error));
    }
  }, [registroSeleccionado, trigger]);

  const handleClick = (id) => {
    setRegistroSeleccionado(id);
    setTrigger(true);
  };

  const columnas = Object.keys(columnasVisibles);

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {cotizacionesFiltrados.length === 0 ? (
            <label className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </label>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr className="">
                  <th className="w-[4rem] max-w-[64px]">
                    <button
                      className="btn-config p-[0.75rem_1.5rem]"
                      disabled
                      onClick={mostrarModal}
                    ></button>
                  </th>
                  <th></th>

                  <th scope="col" className="pl-5 pr-12 py-3 ">
                    Fecha
                  </th>
                  <th scope="col" className="px-12 py-3 ">
                    Numero Cotizacion
                  </th>
                  <th scope="col" className="px-12 py-3 ">
                    Cantidad Destinos
                  </th>
                  <th scope="col" className="px-12 py-3  w-1/3">
                    Cliente
                  </th>
                  <th scope="col" className="px-12 py-3  w-1/3">
                    Contacto Repre
                  </th>
                  <th scope="col" className="px-12 py-3 ">
                    Telefono
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/3 ">
                    Correo Electronico
                  </th>
                  <th scope="col" className="px-12 py-3 ">
                    Validacion
                  </th>
                </tr>
              </thead>
              {cotizacionesFiltrados &&
                cotizacionesActuales.map((cotizacion, index) => (
                  <tr
                    key={cotizacion.id}
                    className={` border-b ${
                      cotizacion.validacion_cotizacion === "Enviado a validar"
                        ? "hover:bg-green-200"
                        : "hover:bg-gray-300"
                    }  ${
                      cotizacion.validacion_cotizacion === "Enviado a validar"
                        ? "bg-green-300"
                        : "bg-white"
                    }`}
                  >
                    <th
                      scope="row"
                      className=" p-[0.75rem_1.5rem] font-medium  z-50 whitespace-nowrap text-gray-900 w-[4rem] max-w-[64px]"
                    >
                      <button
                        className="button-hamburguer text-[#535c69]"
                        onMouseEnter={(e) => handleIconHover(e, cotizacion.id)}
                        onMouseLeave={handleIconHoverExit}
                      >
                        <IconoHamburguesa />
                        {showModal && selectedRow === cotizacion.id && (
                          <div className="colita-modal absolute flex flex-col z-50 bg-slate-100 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-43px] ml-5">
                            <p
                              onClick={() =>
                                handleEnviarValidacion(cotizacion.id_cotizacion)
                              }
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                            >
                              Enviar
                            </p>
                            <p
                              onClick={() =>
                                handleEliminarCotizacion(
                                  cotizacion.id_cotizacion
                                )
                              }
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                            >
                              Eliminar
                            </p>
                          </div>
                        )}
                      </button>
                    </th>
                    <td className="items-center text-[16px] align-middle pb-[2px] cursor-pointer ">
                      <button
                        onClick={() => {
                          handleClick(cotizacion.id_cotizacion);
                        }}
                      >
                        <Imprimir />
                      </button>
                    </td>
                    <td scope="col" className="pl-5 pr-12 py-3 ">
                      {cotizacion.fecha_creado}
                    </td>
                    <td className="px-12 py-4 ">{cotizacion.id_cotizacion}</td>
                    <td className="px-12 py-4 ">
                      {cotizacion.cantidad_destinos_cotizacion}
                    </td>
                    <td className="px-12 py-4 ">
                      {cotizacion.razon_social_cliente}
                    </td>
                    <td className="px-12 py-4 ">
                      {cotizacion.representante_cliente}
                    </td>
                    <td className="px-12 py-4 ">
                      {cotizacion.telefono_cliente}
                    </td>
                    <td className="px-12 py-4 ">{cotizacion.email_cliente}</td>
                    <td className="px-12 py-4 ">
                      {(cotizacion.validacion_cotizacion ?? "").toUpperCase()}
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default Table;
