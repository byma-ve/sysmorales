import {
  IconoConfig,
  IconoHamburguesa,
} from "../../../../Iconos/Iconos-NavBar";
import Pagination from "../../Usuario/Components/PaginacionAdmin";

export const Table = ({
  handleEliminarVehiculo,
  handlePageChange,
  currentPage,
  itemsPerPage,
  totalItems,
  vehiculosActuales,
  vehiculosFiltrados,
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
      <div className="">
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed    text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {vehiculosFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap block">
                <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr>
                    <td className="w-[4rem] max-w-[64px]"></td>

                    <th scope="col" className="px-12 py-3">
                      Placa
                    </th>
                    <th scope="col" className="px-12 py-3 w-1/2">
                      Tipo
                    </th>
                    <th scope="col" className="px-12 py-3">
                      N° Serie
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Soat
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Vigencia Desde
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Vigencia Hasta
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Ultima Revision
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-12 py-3  w-1/2">
                      Tarjeta Propiedad
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Valido
                    </th>
                  </tr>
                </thead>
                {vehiculosFiltrados &&
                  vehiculosActuales.map((vehiculo, index) => (
                    <tr
                      key={index}
                      className="border-b  bg-white border-gray-300 hover:bg-gray-300 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        onMouseEnter={(e) => handleIconHover(e, vehiculo.id)}
                        onMouseLeave={handleIconHoverExit}
                      >
                        <button className="text-[#535c69]">
                          <IconoHamburguesa />
                          {/* Modal */}
                          {showModal && selectedRow === vehiculo.id && (
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
                                  handleEliminarVehiculo(vehiculo.id)
                                }
                              >
                                Eliminar
                              </p>
                            </div>
                          )}
                        </button>
                      </th>
                      <td className="px-12 py-4">{vehiculo.placa_vehiculo}</td>
                      <td className="px-12 py-4">{vehiculo.tipo_vehiculo}</td>
                      <td className="px-12 py-4">
                        {vehiculo.n_serie_vehiculo}
                      </td>
                      <td className="px-12 py-4">{vehiculo.soat_vehiculo}</td>
                      <td className="px-12 py-4">
                        {vehiculo.vigencia_desde_vehiculo}
                      </td>
                      <td className="px-12 py-4">
                        {vehiculo.vigencia_hasta_vehiculo}
                      </td>
                      <td className="px-12 py-4">
                        {vehiculo.ultima_revision_vehiculo}
                      </td>
                      <td className="px-12 py-4">
                        {vehiculo.vencimiento_vehiculo}
                      </td>
                      <td className="px-12 py-4 ">
                        {vehiculo.tarjeta_propiedad_vehiculo}
                      </td>
                      <td className="px-12 py-4 w-full">
                        {vehiculo.validado_vehiculo}
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
