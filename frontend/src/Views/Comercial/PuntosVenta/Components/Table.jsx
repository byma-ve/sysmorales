import { Imprimir } from "../../../../Iconos/Iconos-NavBar";
import React, { useState, useEffect } from "react";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";
import { printPDF } from "./GeneradorPDF";

function Table({
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
  const columnas = Object.keys(columnasVisibles);

  // FUNCION IMPRIMIR
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (registroSeleccionado != null) {
      fetch(
        `https://sistema.transportesmorales-logistik.com/BackendApiRest/Comercial/PuntoVenta/imprimirPdf.php?id_cotizacion=${registroSeleccionado}`
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

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {cotizacionesFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr className="">
                  <th scope="col" className="pl-5 pr-12 py-3 ">
                    Fecha
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Numero Cotizacion
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Cantidad Destinos{" "}
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Cliente
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Contacto Repre
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Telefono
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
                    Correo Electronico
                  </th>
                  <th scope="col" className="px-12 py-3 w-1/6">
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
