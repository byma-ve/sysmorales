import {
  IconoConfig,
  IconoHamburguesa,
} from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../Usuario/Components/PaginacionAdmin";

export const Table = ({
  handleEliminarProveedor,
  handlePageChange,
  currentPage,
  itemsPerPage,
  totalItems,
  proveedoresFiltrados,
  proveedoresActuales,
  mostrarModalEncabezados,
  handleIconHover,
  handleIconHoverExit,
  showModal,
  selectedRow,
  mostrarModalEditar,
  columnasVisibles,
}) => {
  const columnas = Object.keys(columnasVisibles);

  return (
    <div className="">
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {proveedoresFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr>
                  <th className="w-[4rem] max-w-[64px]"></th>
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th key={index} scope="col" className="px-6 py-3">
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {proveedoresFiltrados &&
                proveedoresActuales.map((proveedor, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white  border-gray-300 hover:bg-gray-300"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 "
                      onMouseEnter={(e) => handleIconHover(e, proveedor.id)}
                      onMouseLeave={handleIconHoverExit}
                    >
                      <button className="text-[#535c69]">
                        <IconoHamburguesa />
                        {/* Modal */}
                        {showModal && selectedRow === proveedor.id && (
                          <div className="colita-modal absolute flex flex-col z-50 bg-slate-100 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-43px] ml-6">
                            <p
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              onClick={mostrarModalEditar}
                            >
                              Editar
                            </p>
                            <p
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              onClick={() =>
                                handleEliminarProveedor(proveedor.id)
                              }
                            >
                              Eliminar
                            </p>
                          </div>
                        )}
                      </button>
                    </th>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.dni_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.razon_social_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.representante_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.clave_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {(proveedor.tipo_proveedor ?? "").toUpperCase()}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {(proveedor.tipo_servicio_proveedor ?? "").toUpperCase()}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.departamento}
                    </td>
                    <td className="px-6 py-4 w-1/12">{proveedor.provincia}</td>
                    <td className="px-6 py-4 w-1/12">{proveedor.distrito}</td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.direccion_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.referencias_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.contacto_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.telefono_proveedor}
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      {proveedor.email_proveedor}
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
  );
};
