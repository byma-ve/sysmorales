import { useState } from "react";
import { IconoPermiso } from "../../../Iconos/Iconos-NavBar";
import { Configuracion } from "../Modals/Configuracion";
import Pagination from "../../Administración/Usuario/Components/PaginacionAdmin";

export const Table = ({
  columnasVisibles,
  modalVisible,
  setModalVisible,
  mostrarModal,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  usuariosActuales,
  usuariosFiltrados,
}) => {
  const columnas = Object.keys(columnasVisibles);
  const [dniSeleccionado, setDniSeleccionado] = useState(null);

  return (
    <>
      <div>
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            <tbody className="text-left text-[#535c69] whitespace-nowrap block ">
              <thead className="text-left text-md border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr>
                  <th className="text-left w-[4rem] px-6 py-3 "></th>
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th
                          key={index}
                          scope="col"
                          className="px-10 py-4 w-1/6"
                        >
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {usuariosFiltrados &&
                usuariosActuales.map((usuario, index) => (
                  <tr
                    key={usuario.id}
                    className=" bg-\[#fff\] border-b border-gray-300 hover:bg-gray-300 "
                  >
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      <button
                        onClick={() => {
                          mostrarModal(usuario.id);
                          setDniSeleccionado(usuario.dni_usuario);
                        }}
                        className="text-[#535c69]"
                      >
                        <IconoPermiso />
                      </button>
                    </td>
                    <td className="px-10 py-4 w-1/5">{usuario.dni_usuario}</td>
                    <td className="px-10 py-4 w-1/5">
                      {usuario.colaborador_usuario}
                    </td>
                    <td className="px-10 py-4 w-1/5">
                      {usuario.email_usuario}
                    </td>
                    <td className="px-10 py-4 w-1/5">{usuario.area_usuario}</td>
                    <td className="px-10 py-4 w-1/5">
                      {(usuario.cargo_usuario ?? "").toUpperCase()}
                    </td>
                    <Configuracion
                      dni_usuario={dniSeleccionado}
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                    />
                  </tr>
                ))}
            </tbody>
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
