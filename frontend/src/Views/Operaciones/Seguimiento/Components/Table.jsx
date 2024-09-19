import React, { useState } from "react";
import Pagination from "../../../Administración/Usuario/Components/PaginacionAdmin";
import {
  IconoHamburguesa,
  IconoComentario,
} from "../../../../Iconos/Iconos-NavBar";
import ModalComentario2 from "../Modals/ModalComentario2";
import CAgente from "../Modals/CompletarAgente";
import ModalComentario from "../Modals/ModalComentario";

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10  border rounded shadow-lg">{content}</div>
      )}
    </div>
  );
};

export const Table = ({
  columnasVisibles,
  mostrarModalEncabezados,
  totalItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
  cotizacionesActuales,
  cotizacionesFiltrados,
  actualizarTabla,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const columnas = Object.keys(columnasVisibles);

  // Funcionalidad Insertar Cliente
  const mostrarModalCompletar = (cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setModalVisible(true);
  };

  const [open, setOpen] = useState(false);
  const OpenModal = () => {
    setOpen(!open);
    console.log("open", open);
  };
  return (
    <>
      <ModalComentario open={open} setOpen={setOpen} />
      <CAgente
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedData={selectedCotizacion}
        actualizarTabla={actualizarTabla}
      />
      <div className="">
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed    text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {cotizacionesFiltrados.length === 0 ? (
              <span className="  text-center flex justify-center mt-3 text-base">
                No se encontraron resultados
              </span>
            ) : (
              <tbody className="text-left text-[#535c69] whitespace-nowrap block">
                <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                  <tr className="">
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
                {cotizacionesFiltrados &&
                  cotizacionesActuales.map((cotizacion, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white  border-gray-300 hover:bg-gray-300 cursor-pointer"
                    >
                      <td>
                        <Tooltip
                          content={
                            <button
                              onClick={() => mostrarModalCompletar(cotizacion)}
                              className="colita2-modal absolute flex flex-col z-50 bg-sky-50 p-3 text-slate-700 rounded-md shadow-md text-left mt-[-45px] ml-[45px]"
                            >
                              Completar
                            </button>
                          }
                        >
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-[#535c69] whitespace-nowrap"
                          >
                            <IconoHamburguesa />
                          </td>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3 flex text-center ">
                        <span
                          className={`font-semibold py-[3px] px-2 rounded-lg text-white w-24 ${
                            cotizacion.estado_operacion === "Entregado"
                              ? "bg-green-500"
                              : cotizacion.estado_operacion === "En Despacho"
                              ? "bg-blue-500"
                              : cotizacion.estado_operacion === "En registro"
                              ? "bg-gray-500"
                              : cotizacion.estado_operacion === "Motivado"
                              ? "bg-red-500"
                              : ""
                          }`}
                        >
                          {cotizacion.estado_operacion}
                        </span>
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.fecha_operacion}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.hora_operacion}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.orden_servicio}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.guia_tracking}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.razon_social_cliente}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.nombre_area}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.destino_partida}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.nombre_consignado}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.destino_llegada}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.contenido_envio}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.cantidad_envio}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.peso_masa_envio}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.peso_volumen_envio}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.lead_time}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.tiempo_entrega}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {(cotizacion.entrega_status ?? "").toUpperCase()}
                      </td>

                      <td className="px-8 py-4 w-1/12">
                        {(
                          cotizacion.tipo_cargo_registro_carga ?? ""
                        ).toUpperCase()}
                      </td>
                      <td className="px-8 py-4 w-1/12">
                        {cotizacion.fecha_referencia_registro_carga}
                      </td>

                      <td className="px-8 py-1 w-1/12 text-center text-[18px] hover:text-blue-500">
                        {cotizacion?.observaciones_registro_carga && (
                          <>
                            <button>
                              <ModalComentario2
                                dato={cotizacion.observaciones_registro_carga}
                              />
                            </button>
                          </>
                        )}
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
