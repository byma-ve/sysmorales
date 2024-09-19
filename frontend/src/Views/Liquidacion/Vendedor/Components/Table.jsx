import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

export const Table = ({
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  liquidacionesActuales,
  liquidacionesFiltrados,
  mostrarModalEncabezados,
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
                    {columnas.map(
                      (header, index) =>
                        columnasVisibles[header] && (
                          <th key={index} scope="col" className="px-16 py-3">
                            {header}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                {liquidacionesFiltrados &&
                  liquidacionesActuales.map((liquidacion, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white  border-gray-300 hover:bg-gray-300  "
                    >
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.fecha_creado}
                      </td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.id_cotizacion}
                      </td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.cliente}
                      </td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.vendedor}
                      </td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.costo_envio}
                      </td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.costo_adicional}
                      </td>
                      <td className="px-16 py-4 w-1/6">{liquidacion.venta}</td>
                      <td className="px-16 py-4 w-1/6">
                        {liquidacion.comision}
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
