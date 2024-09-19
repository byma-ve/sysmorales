import { IconoHamburguesa } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

function Table({
  handleAprobarValidacion,
  handleDesaprobarValidacion,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  validacionesActuales,
  validacionesFiltrados,
  mostrarModal,
  handleIconHover,
  handleIconHoverExit,
  showModal,
  selectedRow,
  columnasVisibles,
}) {
  const columnas = Object.keys(columnasVisibles);

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {validacionesFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr className="">
                  <th
                    className="w-[4rem] max-w-[64px]"
                    onClick={mostrarModal}
                  ></th>
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th
                          key={index}
                          scope="col"
                          className="px-16 py-3 w-1/6"
                        >
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {validacionesFiltrados &&
                validacionesActuales.map((validacion, index) => (
                  <tr
                    key={validacion.id}
                    className={` ${
                      validacion.colaborador_usuario != null &&
                      validacion.estado_validacion == 1
                        ? "bg-green-300 text-left border-b border-green-200 hover:bg-green-200"
                        : validacion.colaborador_usuario != null &&
                          validacion.estado_validacion == 0
                        ? "bg-red-300 text-left border-b border-red-200 hover:bg-red-200"
                        : validacion.colaborador_usuario == null &&
                          validacion.estado_validacion == 0
                        ? "bg-[#fff] text-left border-b border-gray-300 hover:bg-gray-300"
                        : "bg-[#fff] text-left border-b border-gray-300 hover:bg-gray-300"
                    } cursor-pointer`}
                  >
                    <th
                      onMouseEnter={(e) => handleIconHover(e, validacion.id)}
                      onMouseLeave={handleIconHoverExit}
                      scope="row"
                      className=" p-[0.75rem_1.5rem] font-medium  z-50 whitespace-nowrap text-gray-900 w-[4rem] max-w-[64px]"
                    >
                      <button className="button-hamburguer text-[#535c69]">
                        <IconoHamburguesa />
                        {validacion.colaborador_usuario == null &&
                          showModal &&
                          selectedRow === validacion.id && (
                            <div className="colita-modal absolute flex flex-col z-50 bg-slate-100 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-43px] ml-6">
                              <p
                                onClick={() =>
                                  handleAprobarValidacion(
                                    validacion.id_orden_servicio_validacion
                                  )
                                }
                                className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              >
                                Aprobar
                              </p>
                              <p
                                onClick={() =>
                                  handleDesaprobarValidacion(
                                    validacion.id_orden_servicio_validacion
                                  )
                                }
                                className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              >
                                Anular
                              </p>
                            </div>
                          )}
                      </button>
                    </th>
                    <td className="px-16 py-4  ">{validacion.fecha_creado}</td>
                    <td className="px-16 py-4 ">
                      {validacion.colaborador_usuario}
                    </td>
                    <td className="px-16 py-4  ">
                      {validacion.id_orden_servicio_validacion}
                    </td>
                    <td className="px-14 py-4 ">
                      {validacion.razon_social_cliente}
                    </td>
                    <td className="px-16 py-4  ">
                      {validacion.cantidad_destinos_cotizacion}
                    </td>
                    <td className="px-16 py-4  ">
                      {(validacion.recibo_cotizacion ?? "").toUpperCase()}
                    </td>
                    <td className="px-14 py-4 w-full ">
                      {validacion.precio_total_cotizacion}
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
