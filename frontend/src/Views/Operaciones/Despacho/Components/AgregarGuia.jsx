import { useState, useEffect } from "react";
import {
  IconoAgregar,
  IconoUnoMas,
  IconoCerrar,
} from "../../../../Iconos/Iconos-NavBar";
import Swal from "sweetalert2";

export const AgregarGuia = ({
  formDespachoValues,
  mostrarModalAgregarEnvio,
  mostrarModalAgregarMasivo,
  selectListaEnvios,
  selectedTransportista,
  cargarListaEnvios,
  cargarGuiasMasivas,
  cargarGuiasUnitario,
}) => {
  const [desactivarBotones, setDesactivarBotones] = useState(true);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(false); // Nuevo estado
  const [valorSeleccionado, setValorSeleccionado] = useState(""); // Nuevo estado

  useEffect(() => {
    // Lógica para desactivar botones
    const desactivarBotones =
      (formDespachoValues.auxiliar_despacho !== "" &&
        formDespachoValues.cantidad_bultos_despacho !== "" &&
        formDespachoValues.conductor_despacho !== "" &&
        formDespachoValues.fecha_creado !== "" &&
        formDespachoValues.guia_transportista_despacho !== "" &&
        formDespachoValues.id_creador_despacho !== "" &&
        formDespachoValues.id_transportista_despacho !== "" &&
        formDespachoValues.placa_despacho !== "" &&
        formDespachoValues.peso_total_despacho !== "" &&
        formDespachoValues.tipo_vehiculo_despacho !== "" &&
        formDespachoValues.ubigeo_despacho !== "" &&
        formDespachoValues.id_auxiliar_despacho === "" &&
        formDespachoValues.id_conductor_despacho === "" &&
        formDespachoValues.id_vehiculo_despacho === "") ||
      (formDespachoValues.cantidad_bultos_despacho !== "" &&
        formDespachoValues.fecha_creado !== "" &&
        formDespachoValues.guia_transportista_despacho !== "" &&
        formDespachoValues.id_auxiliar_despacho !== "" &&
        formDespachoValues.id_conductor_despacho !== "" &&
        formDespachoValues.id_creador_despacho !== "" &&
        formDespachoValues.peso_total_despacho !== "" &&
        formDespachoValues.id_vehiculo_despacho !== "" &&
        formDespachoValues.ubigeo_despacho !== "" &&
        formDespachoValues.auxiliar_despacho === "" &&
        formDespachoValues.conductor_despacho === "" &&
        formDespachoValues.id_transportista_despacho === "" &&
        formDespachoValues.placa_despacho === "" &&
        formDespachoValues.tipo_vehiculo_despacho === "");
    setDesactivarBotones(desactivarBotones);
  }, [formDespachoValues]);

  const [busquedaGuia, setBusquedaGuia] = useState("");
  const filtrarGuias = () => {
    return selectListaEnvios.filter((guia) =>
      guia.id_num_guia_despacho_envio.includes(busquedaGuia)
    );
  };

  const handleSelectChange = (event) => {
    setOpcionSeleccionada(true);
    setValorSeleccionado(event.target.value);
  };

  const eliminarGuia = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Está seguro de que desea eliminar la guía?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(
          `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/eliminarGuia.php?valorSeleccionado=${valorSeleccionado}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();
        if (responseData.success) {
          Swal.fire({
            icon: "success",
            title: responseData.message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: responseData.message,
          });
        }
        cargarListaEnvios(selectedTransportista);
        cargarGuiasUnitario();
        cargarGuiasMasivas();
      } catch (error) {
        console.error("Error al enviar el valor a la API:", error);
        Swal.fire({
          icon: "error",
          title: "Error al enviar el valor",
          text: "Ha ocurrido un error al enviar el valor a la API.",
        });
      }
    }
  };

  return (
    <>
      <div className="Lista Envios ml-2">
        <div className="side-panel-iframe">
          <div className="side-panel-iframe  rounded-md">
            <div className="side-panel bg-[#fff] rounded-xl">
              <div className="side-cont-titulo  uppercase font-semibold text-white">
                <div className="side-titulo mb-2 py-2 px-5 rounded-t-xl bg-blue-400 flex justify-between">
                  <h1 className="side-txt text-[14px]">Agregar Guia</h1>
                  <div className="p-0">
                    <button
                      className={`text-2xl ${
                        !(desactivarBotones && desactivarBotones)
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!desactivarBotones}
                    >
                      <IconoAgregar onClick={mostrarModalAgregarEnvio} />
                    </button>
                    <button
                      className={`text-2xl ${
                        !(desactivarBotones && desactivarBotones)
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!desactivarBotones}
                    >
                      <IconoUnoMas onClick={mostrarModalAgregarMasivo} />
                    </button>
                    <button
                      className={`text-2xl ${
                        !(desactivarBotones && opcionSeleccionada)
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!desactivarBotones || !opcionSeleccionada}
                      onClick={eliminarGuia}
                    >
                      <IconoCerrar />
                    </button>
                  </div>
                </div>
              </div>
              <div className="section-crm mx-5 w-[90%] h-[38.5rem]">
                <input
                  className="w-[95%] pl-1 text-gray-400 text-sm border rounded-sm focus:outline-none focus:ring-2 ring-1 focus:border-blue-500"
                  placeholder="Buscar Guia"
                  value={busquedaGuia}
                  onChange={(e) => setBusquedaGuia(e.target.value)}
                />
                <select
                  multiple
                  id="countries_multiple"
                  className="bg-white pl-1 pt-1 border mx-auto my-3 focus:outline-none focus:ring-2 h-[34rem] w-[95%] overflow-y ScrollTable overflow-ellipsis text-sm ring-1 text-gray-400  "
                  onChange={handleSelectChange}
                >
                  {filtrarGuias().map((lista_envios) => (
                    <option
                      key={lista_envios.id_num_guia_despacho_envio}
                      value={lista_envios.id_num_guia_despacho_envio}
                    >
                      {lista_envios.id_num_guia_despacho_envio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
