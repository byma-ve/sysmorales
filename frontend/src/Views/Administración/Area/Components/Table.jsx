import { IconoHamburguesa } from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../Usuario/Components/PaginacionAdmin";

export const Table = ({
  handleEliminarArea,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  areasActuales,
  areasFiltrados,
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
    <>
      <div className="block">
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {areasFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap block">
                <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr>
                    <td className="w-[4rem] max-w-[64px]"></td>

                    <th scope="col" className="px-12 py-3 w-1/3">
                      Cliente
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Area
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Contacto
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Cargo Contacto
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Telefono
                    </th>
                    <th scope="col" className="px-12 py-3  w-1/3">
                      Email
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Contacto extra
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Telefono extra
                    </th>
                    <th scope="col" className="px-12 py-3  w-1/3">
                      Email extra
                    </th>
                  </tr>
                </thead>
                {areasFiltrados &&
                  areasActuales.map((area, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white  border-gray-300 hover:bg-gray-300 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        onMouseEnter={(e) => handleIconHover(e, area.id)}
                        onMouseLeave={handleIconHoverExit}
                      >
                        <button className="text-[#535c69]">
                          <IconoHamburguesa />
                          {/* Modal */}
                          {showModal && selectedRow === area.id && (
                            <div className="colita-modal absolute flex flex-col z-50 bg-slate-100 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-43px] ml-6">
                              <p
                                className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                                onClick={mostrarModalEditar}
                              >
                                Editar
                              </p>
                              <p
                                className="text-sm hover:bg-gray-200 px-1 w-24 hover:rounded-sm"
                                onClick={() => handleEliminarArea(area.id)}
                              >
                                Eliminar
                              </p>
                            </div>
                          )}
                        </button>
                      </th>
                      <td className="px-12 py-4 cont-logo">
                        {area.razon_social_cliente}
                      </td>
                      <td className="px-12 py-4">{area.nombre_area}</td>
                      <td className="px-12 py-4">{area.contacto_area}</td>
                      <td className="px-12 py-4">{area.cargo_contacto_area}</td>
                      <td className="px-12 py-4">{area.telefono_area}</td>
                      <td className="px-12 py-4">{area.email_area}</td>
                      <td className="px-12 py-4">{area.contacto_extra_area}</td>
                      <td className="px-12 py-4">{area.telefono_extra_area}</td>
                      <td className="px-12 py-4 w-full">
                        {area.email_extra_area}
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
