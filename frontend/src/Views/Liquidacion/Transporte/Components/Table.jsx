import { IconoHamburguesa, IconoPDF } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

export const Table = ({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  liquidacionesActuales,
  liquidacionesFiltrados,
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
          <table className="w-[100%] table-fixed    text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {liquidacionesFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap  block">
                <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr className="">
                    <th className="w-[4rem] max-w-[64px]"></th>
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
                      key={liquidacion.id}
                      className="border-b bg-white  border-gray-300 hover:bg-gray-300 "
                    >
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        onMouseEnter={(e) => handleIconHover(e, liquidacion.id)}
                        onMouseLeave={handleIconHoverExit}
                      >
                        <button className="text-[#535c69]">
                          <IconoHamburguesa />
                          {/* Modal */}
                          {showModal && selectedRow === liquidacion.id && (
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
                      <td className="px-8 py-4">
                        {liquidacion.estado_documento}
                      </td>
                      <td className="px-8 py-4">
                        {liquidacion.tipo_documento}
                      </td>
                      <td className="px-8 py-4">
                        {liquidacion.numero_documento}
                      </td>
                      <td className="px-8 py-4">{liquidacion.fecha_creado}</td>
                      <td className="px-8 py-4">
                        {liquidacion.id_num_manifiesto_despacho}
                      </td>
                      <td className="px-8 py-4">
                        {liquidacion.razon_social_proveedor}
                      </td>
                      <td className="px-8 py-4 w-1/2">
                        {liquidacion.destino_origen}
                      </td>
                      <td className="px-8 py-4 w-1/2">
                        {liquidacion.destino_llegada}
                      </td>
                      <td className="px-8 py-4">
                        {liquidacion.cantidad_bultos_despacho}
                      </td>
                      <td className="px-8 py-4">
                        {liquidacion.peso_total_despacho}
                      </td>
                      <td className="px-8 py-4">{liquidacion.costo_envio}</td>
                      <td className="px-8 py-4">{liquidacion.igv}</td>
                      <td className="px-8 py-4">{liquidacion.precio_total}</td>
                      <td className="px-8 py-4 flex text-lg justify-center">
                        {liquidacion?.pdf ? (
                          <a href={liquidacion.pdf} target="_blank">
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
