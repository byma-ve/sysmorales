import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

export const TablaAereo = ({
  handlePageChange,
  currentPage,
  itemsPerPage,
  totalItems,
  courriersFiltrados,
  courriersActuales,
  mostrarModal,
  columnasVisibles,
}) => {
  const columnas = Object.keys(columnasVisibles);

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {courriersFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr>
                  <th scope="col" className="text-left w-[4rem]"></th>
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
              {courriersFiltrados &&
                courriersActuales.map((courrier, index) => (
                  <tr
                    key={courrier.id}
                    className="border-b bg-white  border-gray-300 hover:bg-gray-300 cursor-pointer"
                  >
                    <td className="w-[4rem] px-6 y-3"></td>
                    <td className="px-10 py-4 ">{courrier.ubigeo}</td>
                    <td className="px-10 py-4 ">{courrier.zona}</td>
                    <td className="px-10 py-4 ">{courrier.departamento}</td>
                    <td className="px-10 py-4 ">{courrier.provincia}</td>
                    <td className="px-10 py-4 ">{courrier.distrito}</td>
                    <td className="px-10 py-4 ">
                      {courrier.kg_tarifario_agente_aereo}
                    </td>
                    <td className="px-10 py-4 ">
                      {courrier.kg_adicional_tarifario_agente_aereo}
                    </td>
                    <td className="px-10 py-4 ">
                      {courrier.tmin_tarifario_agente_aereo}
                    </td>
                    <td className="px-10 py-4 ">
                      {courrier.tmax_tarifario_agente_aereo}
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
};
