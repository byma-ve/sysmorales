import { IconoHamburguesa, IconoPDF } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

export const Table = ({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  liquidacionesActuales,
  liquidacionesFiltrados,

  mostrarModalEncabezados,
  handleIconHover,
  handleIconHoverExit,
  showModal,
  selectedRow,
  mostrarModalCompletar,
  columnasVisibles,
}) => {
  const columnas = Object.keys(columnasVisibles);

  return (
    <>
      <div>
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {liquidacionesFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap  block">
                <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr className="">
                    <th
                      className="w-[4rem] max-w-[64px]"
                      onClick={mostrarModalEncabezados}
                    >
                      <button
                        className="btn-config p-[0.75rem_1.5rem]
                    "
                        disabled
                      ></button>
                    </th>
                    {columnas.map(
                      (header, index) =>
                        columnasVisibles[header] && (
                          <th key={index} scope="col" className="px-8 py-3">
                            {header}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                {liquidacionesFiltrados &&
                  liquidacionesActuales.map((liquidacion, index) => (
                    <tr
                      key={liquidacion.id_orden_servicio_validacion}
                      className="border-b bg-white  border-gray-300 hover:bg-gray-300 "
                    >
                      <td
                        scope="row"
                        className="px-6 py-4 text-[#535c69] font-medium"
                        onMouseEnter={(e) =>
                          handleIconHover(
                            e,
                            liquidacion.id_orden_servicio_validacion
                          )
                        }
                        onMouseLeave={handleIconHoverExit}
                      >
                        <button>
                          <IconoHamburguesa />
                          {showModal &&
                            selectedRow ===
                              liquidacion.id_orden_servicio_validacion && (
                              <div className="colita2-modal absolute flex flex-col z-50 bg-sky-50 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-27px] ml-6">
                                <p
                                  className="text-sm"
                                  onClick={mostrarModalCompletar}
                                >
                                  Completar
                                </p>
                              </div>
                            )}
                        </button>
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.estado_documento}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.tipo_documento}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.numero_documento}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.fecha_orden}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.id_orden_servicio_validacion}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.razon_social_cliente}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.nombre_area}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.cantidad_guias}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.guias_proceso}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.costos_envios}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.costos_adicionales}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.sub_total}
                      </td>
                      <td className="px-8 py-4 w-1/12">{liquidacion.igv}</td>
                      <td className="px-8 py-4 w-1/12">
                        {liquidacion.precio_total}
                      </td>
                      <td className="px-8 py-4 text-lg flex justify-center">
                        {liquidacion?.pdf_liquidacion_cliente ? (
                          <a
                            href={liquidacion.pdf_liquidacion_cliente}
                            target="_blank"
                          >
                            <IconoPDF />
                          </a>
                        ) : null}
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
      </div>
    </>
  );
};
