import {
  IconoHamburguesa,
  IconoConfig,
  IconoAdministracion,
  IconoMuñeco,
  IconoBox,
  IconoTruck,
  Imprimir,
} from "../../../../Iconos/Iconos-NavBar";
import { useState } from "react";
import LogoLogis from "../../../../Static/Img_Pred/Icons.png";
import jsPDF from "jspdf";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";

export const Table = ({
  columnasVisibles,
  mostrarModalEncabezados,
  mostrarModalAgente,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  despachosActuales,
  despachosFiltrados,
  handleIconHoverExitAgentes,
  handleIconHoverAgentes,
}) => {
  // Mostrar el pequeño modal
  const [showModal, setShowModal] = useState(false);
  // seleccionamos la fila a mostrar el modal
  const [selectedRow, setSelectedRow] = useState(null);
  // Visibilidad del Modal Eliminar e Imprimir
  const [modalVisible2, setModalVisible2] = useState(false);
  // Columnas seleccionadas
  const columnas = Object.keys(columnasVisibles);

  // Evento Hover para Btn-Hamburguesa (Modal)
  const handleIconHover = (e, dni) => {
    setShowModal(true);
    setSelectedRow(dni);
  };

  const handleIconHoverExit = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funcionalidad Eliminar e Imprimir
  const mostrarModal2 = () => {
    handleCloseModal();
    setModalVisible2(true);
  };

  return (
    <>
      <div className="mr-2">
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {despachosFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="block text-[#535c69] whitespace-nowrap ">
                <thead className=" text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr className="">
                    {/* <th></th> */}
                    <th className="px-5 py-3 w-1/6"></th>
                    <th className="px-5 py-3 w-1/6">Fecha</th>
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
                {despachosFiltrados &&
                  despachosActuales.map((despacho, index) => (
                    <tr
                      key={despacho.id_num_manifiesto_despacho}
                      className=" bg-[#fff] text-left border-b border-gray-300 hover:bg-gray-300 "
                    >
                      <th
                        scope="row"
                        className=" p-[0.75rem_1.5rem] font-medium  z-50 whitespace-nowrap text-gray-900 w-[4rem] max-w-[64px]"
                      >
                        <button className="items-center text-[16px] align-middle pb-[2px] cursor-pointer  text-[#535c69]">
                          <Imprimir />
                        </button>
                      </th>

                      <td className="px-5 py-4 ">{despacho.fecha_creado}</td>
                      <td className="px-10 py-4 ">
                        {despacho.id_num_manifiesto_despacho}
                      </td>
                      <td className="px-10 py-4 ">
                        {despacho.guia_transportista_despacho}
                      </td>
                      <td className="px-10 py-4 ">
                        {despacho.id_transportista_despacho}
                      </td>
                      <td className="px-10 py-4 ">{despacho.destino}</td>
                      <td className="px-10 py-4 ">
                        {despacho.cantidad_bultos_despacho}
                      </td>
                      <td className="px-10 py-4 ">{despacho.total_guias}</td>
                      <td className="px-9 py-1  w-full ">
                        <button
                          className="cursor-pointer flex text-center  items-center  justify-items-center "
                          onClick={mostrarModalAgente}
                          onMouseEnter={(e) =>
                            handleIconHoverAgentes(
                              e,
                              despacho.id_num_manifiesto_despacho
                            )
                          }
                          onMouseLeave={handleIconHoverExitAgentes}
                        >
                          <IconoTruck className="ml-[22px] text-xl" />
                        </button>
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
