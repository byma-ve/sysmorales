import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SearchServicio from "../Components/SelectBuscador/SearchServicio";
import SearchAgenteMasivo from "../Components/SelectBuscador/SelectAgenteMasivo";
function ModalAgregarMasivo({
  modalAgregarMasivo,
  setModalAgregarMasivo,
  setSelectedAgente,
  setDatosAgente,
  selectedAgente,
  datosAgente,
  selectAgentes,
  handleSelectAgente,
  selectGuiasMasivas,
  selectedGuiaMasiva,
  handleSelectGuiaMasiva,
  setSelectedGuiaMasiva,
  selectedTransportista,
  cargarGuiasMasivas,
  cargarListaEnvios,
}) {
  // Funcion Ocultar Modal
  const ocultarModalAgregarMasivo = () => {
    setModalAgregarMasivo(false);
    setDatosAgente([]);
    setSelectedAgente("");
    setSelectedGuiaMasiva("");
    cargarGuiasMasivas();
  };

  const [formData, setFormData] = useState({
    id_transportista_despacho_envio: selectedTransportista,
    id_num_guia_despacho_envio: "",
    id_agente_despacho_envio: "",
    tipo_envio_despacho_envio: "",
    id_creador: localStorage.getItem("id_usuario"),
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      id_transportista_despacho_envio: selectedTransportista,
    }));
  }, [selectedTransportista]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "id_agente_despacho_envio" && value) {
      newFormData = { ...newFormData, tipo_envio_despacho_envio: "" };
    }

    setFormData(newFormData);
  };

  const resetFormData = {
    id_transportista_despacho_envio: selectedTransportista,
    id_num_guia_despacho_envio: "",
    id_agente_despacho_envio: "",
    tipo_envio_despacho_envio: "",
    id_creador: localStorage.getItem("id_usuario"),
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // ESTILOS DE PRECARGADO
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "transparent",
      html: `
      <div class="papapa"> 
        <div class="loader1"> 
        <h1 class="guardado" >Guardando...</h1>
        </div>
      
        <div class="loader2">
          <div class="justify-content-center jimu-primary-loading"></div>
        </div>
      </div>
    `,
      onBeforeOpen: () => {
        // Función que se ejecuta antes de que se abra la ventana modal
        Swal.showLoading(); // Muestra una animación de carga dentro de la ventana modal
      },
    });

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/guardarEnvioMasivo.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
      cargarGuiasMasivas();
      setFormData(resetFormData);
      setDatosAgente([]);
      setSelectedAgente("");
      setSelectedGuiaMasiva("");
      console.log(responseData.datos);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Red",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalAgregarMasivo ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalAgregarMasivo ? "translate-y-0" : "translate-y-[300%]"
          } w-[800px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4   ">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Asignar Orden Servicio</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <form className="mb-1 text-black" onSubmit={handleFormSubmit}>
                    <div className=" card-container">
                      {/* DATOS DE ENVIO*/}
                      <div className="grid grid-cols-2   px-5  mr-2  gap-2 mb-2">
                        <label className=" text-sm  ">Datos de Orden</label>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className=" text-xs ">O. Servicio</label>
                        </div>
                        <div className="ml-[-60px]">
                          <SearchServicio
                            servicios={selectGuiasMasivas}
                            setSelectedServicio={(servicio) => {
                              handleSelectGuiaMasiva(servicio);
                              handleInputChange({
                                target: {
                                  name: "id_num_guia_despacho_envio",
                                  value:
                                    servicio.id_orden_servicio_registro_carga,
                                },
                              });
                            }}
                            selectedServicioId={selectedGuiaMasiva}
                          />
                        </div>
                      </div>
                      {/* COSTEO DE DESTINO AGENTE */}
                      <div className="grid grid-cols-2   px-5  mr-2  gap-2 my-3">
                        <h2 className=" text-sm  ">Datos de Destino Agente</h2>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className=" text-xs ">Nombre-Agente</label>
                        </div>
                        <div className="ml-[-60px]">
                          <SearchAgenteMasivo
                            agentes={selectAgentes}
                            setSelectedAgente={(agente) => {
                              handleSelectAgente(agente);
                              handleInputChange({
                                target: {
                                  name: "id_agente_despacho_envio",
                                  value: agente.id,
                                },
                              });
                            }}
                            selectedAgenteEnvio={selectedAgente}
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Provincia</label>
                        </div>
                        <div className="ml-[-100px]">
                          <select className="w-[90%] pl-1 text-xs h-5 border  px-1 rounded-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">
                              {datosAgente.PROVINCIA
                                ? datosAgente.PROVINCIA
                                : ""}
                            </option>
                          </select>
                        </div>
                        <div className="">
                          <label className=" text-xs">Departamento</label>
                        </div>
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">
                              {datosAgente.DEPARTAMENTO
                                ? datosAgente.DEPARTAMENTO
                                : ""}
                            </option>
                          </select>
                        </div>
                        <div className="">
                          <label className=" text-xs">Distrito</label>
                        </div>
                        <div className="ml-[-100px]">
                          <select className="w-[90%] text-xs h-5 border  px-1 rounded-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">
                              {datosAgente.DESTINO ? datosAgente.DESTINO : ""}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-8 h-4">
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={ocultarModalAgregarMasivo}
                          type="button"
                          className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalAgregarMasivo;
