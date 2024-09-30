import Asignar from "../Modals/Asignar";
import { IconoHamburguesa } from "../../../../Iconos/Iconos-NavBar";
import { useState } from "react";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

function Table({
  actualizarTabla,
  datosAsignacion,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  asignacionesActuales,
  asignacionesFiltrados,
  handleIconHover,
  handleIconHoverExit,
  selectedRow,
  showModal,
  mostrarModalEncabezados,
  columnasVisibles,
}) {
  const columnas = Object.keys(columnasVisibles);
  const [modalAsignar, setModalAsignar] = useState(false);

  // Abrir Modal de Asignar
  const HandleOpenModal = () => {
    setModalAsignar(true);
  };

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {asignacionesFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr className="">
                  <th className="w-[4rem] max-w-[64px]"></th>
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th
                          key={index}
                          scope="col"
                          className="px-10 py-3 w-1/6"
                        >
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {asignacionesFiltrados &&
                asignacionesActuales.map((asignacion, index) => (
                  <tr
                    key={asignacion.id_orden_servicio}
                    className={` ${
                      asignacion.id_proveedor_recojo !== null ||
                      asignacion.id_conductor_recojo !== null
                        ? " bg-green-300 border-green-200 hover:bg-green-200"
                        : " bg-[#fff] border-gray-300 hover:bg-gray-300"
                    } text-left border-b cursor-pointer`}
                  >
                    <td
                      onMouseEnter={(e) =>
                        handleIconHover(e, asignacion.id_orden_servicio)
                      }
                      onMouseLeave={handleIconHoverExit}
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
                    >
                      <button className="button-hamburguer text-[#535c69]">
                        <IconoHamburguesa />
                        {showModal &&
                          selectedRow === asignacion.id_orden_servicio && (
                            <div className="colita2-modal absolute flex flex-col z-50 bg-sky-50 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-28px] ml-6">
                              <p
                                onClick={HandleOpenModal}
                                className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              >
                                Asignar
                              </p>
                              {/* )} */}
                            </div>
                          )}
                      </button>
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.id_orden_servicio}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.fecha_programacion}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.hora_programacion}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.razon_social_cliente}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.contacto_programacion}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.departamento} - {asignacion.provincia} -{" "}
                      {asignacion.distrito}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.id_proveedor_recojo === null &&
                      asignacion.id_conductor_recojo !== null
                        ? "PROPIOS"
                        : asignacion.id_proveedor_recojo !== null &&
                          asignacion.id_conductor_recojo === null
                        ? "EXTERNOS"
                        : ""}
                    </td>
                    <td className="px-10 py-4 ">
                      {asignacion.id_proveedor_recojo === null &&
                      asignacion.id_conductor_recojo !== null
                        ? asignacion.nombre_conductor
                        : asignacion.id_proveedor_recojo !== null &&
                          asignacion.id_conductor_recojo === null
                        ? asignacion.nombre_conductor_recojo
                        : ""}
                    </td>
                    <td className="px-10 py-4 w-full">
                      {asignacion.id_proveedor_recojo === null &&
                      asignacion.id_conductor_recojo !== null
                        ? asignacion.nombre_auxiliar
                        : asignacion.id_proveedor_recojo !== null &&
                          asignacion.id_conductor_recojo === null
                        ? asignacion.nombre_auxiliar_recojo
                        : ""}
                    </td>
                    <td className="px-10 py-4 w-full">
                      {asignacion.id_proveedor_recojo === null &&
                      asignacion.id_conductor_recojo !== null
                        ? asignacion.nombre_placa
                        : ""}
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
      {/* Modal de Asignar */}
      <Asignar
        actualizarTabla={actualizarTabla}
        modalAsignar={modalAsignar}
        setModalAsignar={setModalAsignar}
        datosAsignacion={datosAsignacion}
      />
    </>
  );
}

export default Table;
