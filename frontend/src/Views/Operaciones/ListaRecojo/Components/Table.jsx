import { IconoOjito } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";
import ModalImagen from "../Modals/ModalImagen";
function Table({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  cotizacionesActuales,
  cotizacionesFiltrados,
  columnasVisibles,
}) {
  const columnas = Object.keys(columnasVisibles);

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
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th
                          key={index}
                          scope="col"
                          className="px-14 py-3 w-full "
                        >
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {cotizacionesFiltrados &&
                cotizacionesActuales.map((cotizacion, index) => (
                  <tr
                    key={index}
                    className=" bg-[#fff] text-left border-b border-gray-300 hover:bg-gray-300 "
                  >
                    <td className="px-12 py-3 text-center flex items-center ">
                      <span
                        className={`font-semibold py-[3px] px-2 rounded-lg text-white w-[100px] ${
                          cotizacion.estado_recojo === "Recogido"
                            ? "bg-cyan-500"
                            : cotizacion.estado_recojo === "Falta recoger"
                            ? "bg-red-500"
                            : ""
                        }`}
                      >
                        {cotizacion.estado_recojo}
                      </span>
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.id_orden_servicio_recojo}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.fecha_programacion}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.hora_programacion}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.razon_social_cliente}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.nombre_area}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.DEPARTAMENTO} , {cotizacion.PROVINCIA} ,{" "}
                      {cotizacion.DESTINO}
                    </td>
                    <td className="px-14 py-4 w-1/6 ">
                      {cotizacion.comentario_estado_recojo !== null
                        ? cotizacion.comentario_estado_recojo
                        : ""}
                    </td>
                    <td className="px-14 2 w-1/6 text-center  ">
                      {cotizacion.imagen_estado_recojo !== null ? (
                        // <a
                        //   href={cotizacion.imagen_estado_recojo}
                        //   target="_blank"
                        //   className=" "
                        // >
                        <ModalImagen className=" mx-auto" />
                      ) : (
                        // </a>
                        "(Falta Imagen)"
                      )}
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
