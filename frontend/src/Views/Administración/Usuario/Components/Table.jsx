import {
  IconoConfig,
  IconoHamburguesa,
} from "../../../../Iconos/Iconos-NavBar";
import Pagination from "./PaginacionAdmin";
import { Avatar } from "@nextui-org/react";
export const Table = ({
  handleEliminarUsuario,
  handlePageChange,
  currentPage,
  itemsPerPage,
  totalItems,
  usuariosFiltrados,
  usuariosActuales,
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
      <div>
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            {usuariosFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap block ">
                <thead className="text-left text-md border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr>
                    <th className="w-[4rem] max-w-[64px]"></th>

                    <th className="px-12 py-3 w-1/6">Foto</th>
                    <th className="px-12 py-3 w-1/6">DNI</th>
                    <th className="px-12 py-3 w-1/6">Clave</th>
                    <th className="px-12 py-3 w-1/6 ">Colaborador</th>
                    <th className="px-12 py-3 w-1/6">Brevete</th>
                    <th className="px-12 py-3 w-1/6">Telefono</th>
                    <th className="px-12 py-3 w-1/6">Email</th>
                    <th className="px-12 py-3 w-1/6">Area</th>
                    <th className="px-12 py-3 w-1/6">Cargo</th>
                  </tr>
                </thead>
                {usuariosFiltrados &&
                  usuariosActuales.map((usuario, index) => (
                    <tr
                      key={usuario.id}
                      className="border-b bg-white border-gray-300 hover:bg-gray-300 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 "
                        onMouseEnter={(e) => handleIconHover(e, usuario.id)}
                        onMouseLeave={handleIconHoverExit}
                      >
                        <button className="text-[#535c69]">
                          <IconoHamburguesa />
                          {/* Modal */}
                          {showModal && selectedRow === usuario.id && (
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
                                  handleEliminarUsuario(usuario.id)
                                }
                              >
                                Eliminar
                              </p>
                            </div>
                          )}
                        </button>
                      </th>
                      <td className="px-[42px]  cont-logo  ">
                        <Avatar
                          src={`https://images.weserv.nl/?url=${usuario.foto_usuario}`}
                        />
                        {/* <img
                          src={`https://images.weserv.nl/?url=${usuario.foto_usuario}`}
                          alt=""
                          className=" w-10  rounded-full"
                        /> */}
                      </td>
                      <td className="px-12 py-4 ">{usuario.dni_usuario}</td>
                      <td className="px-12 py-4 ">{usuario.clave_usuario}</td>
                      <td className="px-12 py-4 ">
                        {usuario.colaborador_usuario}
                      </td>
                      <td className="px-12 py-4 ">{usuario.brevete_usuario}</td>
                      <td className="px-12 py-4 ">
                        {usuario.telefono_usuario}
                      </td>
                      <td className="px-12 py-4 ">{usuario.email_usuario}</td>
                      <td className="px-12 py-4 ">{usuario.area_usuario}</td>
                      <td className="px-12 py-4 ">
                        {(usuario.cargo_usuario ?? "").toUpperCase()}
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
