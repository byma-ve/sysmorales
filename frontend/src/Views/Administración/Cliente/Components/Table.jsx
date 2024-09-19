import React from "react";
import { IconoHamburguesa } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../Usuario/Components/PaginacionAdmin";

const Table = ({
  handleEliminarCliente,
  handlePageChange,
  currentPage,
  itemsPerPage,
  totalItems,
  clientesFiltrados,
  clientesActuales,
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
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {clientesFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr>
                  <td className="w-[4rem] max-w-[64px]"></td>
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
              {clientesFiltrados &&
                clientesActuales.map((cliente, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white  border-gray-300 hover:bg-gray-300 "
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 "
                      onMouseEnter={(e) => handleIconHover(e, cliente.id)}
                      onMouseLeave={handleIconHoverExit}
                    >
                      <button className="text-[#535c69]">
                        <IconoHamburguesa />
                        {/* Modal */}
                        {showModal && selectedRow === cliente.id && (
                          <div className="colita-modal absolute flex flex-col z-50 bg-slate-100 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-43px] ml-6">
                            <p
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              onClick={mostrarModalEditar}
                            >
                              Editar
                            </p>
                            <p
                              className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                              onClick={() => handleEliminarCliente(cliente.id)}
                            >
                              Eliminar
                            </p>
                          </div>
                        )}
                      </button>
                    </th>
                    <td className="px-8 py-4 w-1/12 ">{cliente.dni_cliente}</td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.razon_social_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.representante_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.clave_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.colaborador_usuario}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.limite_credito_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.alerta_credito_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">{cliente.departamento}</td>
                    <td className="px-8 py-4 w-1/12">{cliente.provincia}</td>
                    <td className="px-8 py-4 w-1/12">{cliente.distrito}</td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.direccion_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.referencias_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.contacto_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.telefono_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">
                      {cliente.email_cliente}
                    </td>
                    <td className="px-8 py-4 w-1/12">{cliente.area_cliente}</td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <div>
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Table;
