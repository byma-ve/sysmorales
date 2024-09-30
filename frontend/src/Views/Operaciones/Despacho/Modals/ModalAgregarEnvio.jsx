import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SearchTracking from "../Components/SelectBuscador/SearchTracking";
import SearchAgente from "../Components/SelectBuscador/SearchAgente";
import Select from "react-select";

const customStyles3 = {
  control: (provided, state) => ({
    ...provided,
    maxHeight: "23px",
    minHeight: "20px",
    height: "2px",
    fontSize: "12px",
    borderRadius: "5px",
    backgroundColor: "transparent",
    border: "none",
    marginTop: "-3px",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "120px",
    overflowY: "auto",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    fontSize: "12px",
    margin: "6px 0",
    padding: "2px 0px",
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    padding: "2px 4px",
    maxHeight: "20px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 20px 1px 2px",
    marginTop: "-6px",
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    // display: "none", // Oculta el indicador
    marginTop: "-6px",
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta la barrita al lado del indicador
  }),
};
function ModalAgregarEnvio({
  modalAgregarEnvio,
  setModalAgregarEnvios,
  selectGuiasUnitario,
  handleSelectGuiaUnitaria,
  datosGuiaUnitaria,
  selectedGuiaUnitaria,
  setSelectedGuiaUnitaria,
  setDatosGuiaUnitaria,
  handleSelectAgente,
  selectAgentes,
  datosAgente,
  selectedAgente,
  setDatosAgente,
  setSelectedAgente,
  selectedTransportista,
  cargarGuiasUnitario,
  cargarListaEnvios,
}) {
  const ocultarModalAgregarEnvio = () => {
    setModalAgregarEnvios(false);
    setSelectedGuiaUnitaria("");
    setDatosGuiaUnitaria([]);
    setDatosAgente([]);
    setSelectedAgente("");
    cargarGuiasUnitario();
    setFormData(resetFormData);
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

  const handleInputChange = (name, value) => {
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
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/guardarEnvioUnitario.php",
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
      cargarGuiasUnitario();
      setFormData(resetFormData);
      setSelectedGuiaUnitaria("");
      setDatosGuiaUnitaria([]);
      setDatosAgente([]);
      setSelectedAgente("");
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
          modalAgregarEnvio ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalAgregarEnvio ? "translate-y-0" : "translate-y-[600%]"
          } w-[800px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4   ">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0   ">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Asignar Guía Tracking</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <form className="mb-1 text-black" onSubmit={handleFormSubmit}>
                    <div className=" card-container">
                      {/* DATOS DE ENVIO*/}
                      <div className="grid grid-cols-2   px-5  mr-2  gap-2 mb-2">
                        <h1 className="text-black text-sm  ">Datos de Envio</h1>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className=" text-xs ">N° Tracking</label>
                        </div>
                        <div className="ml-[-60px]">
                          {/* <SearchTracking
                            selectedGuiaUnitaria={selectedGuiaUnitaria}
                            trackings={selectGuiasUnitario}
                            setSelectedTracking={(tracking) => {
                              handleSelectGuiaUnitaria(tracking);
                              handleInputChange({
                                target: {
                                  name: "id_num_guia_despacho_envio",
                                  value: tracking.id_num_guia_registro_carga,
                                },
                              });
                            }}
                          /> */}

                          <Select
                            name="id_num_guia_despacho_envio"
                            id="id_num_guia_despacho_envio"
                            styles={customStyles3}
                            options={selectGuiasUnitario}
                            onChange={(selectedOption) => {
                              const value = selectedOption.value;
                              handleInputChange(
                                "id_num_guia_despacho_envio",
                                value
                              );
                              handleSelectGuiaUnitaria(value);
                            }}
                            value={
                              selectedGuiaUnitaria
                                ? selectGuiasUnitario.find(
                                    (option) =>
                                      option.value === selectedGuiaUnitaria
                                  )
                                : null
                            }
                            className="border rounded-sm  mt-1 w-[90%] "
                            required
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Tipo-Tarifa</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            readOnly
                            type="text"
                            value={
                              datosGuiaUnitaria.tarifario_destino
                                ? datosGuiaUnitaria.tarifario_destino.toUpperCase()
                                : ""
                            }
                            id="consignacion-envio"
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Consignado</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            readOnly
                            type="text"
                            value={
                              datosGuiaUnitaria.consignado_destino
                                ? datosGuiaUnitaria.consignado_destino
                                : ""
                            }
                            id="rucDni-envio"
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Departamento</label>
                        </div>
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
                            <option value="">
                              {datosGuiaUnitaria.DEPARTAMENTO
                                ? datosGuiaUnitaria.DEPARTAMENTO
                                : ""}
                            </option>
                          </select>
                        </div>
                        <div className="">
                          <label className=" text-xs">RUC/DNI</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            disabled
                            type="text"
                            value={
                              datosGuiaUnitaria.dni_ruc_destino
                                ? datosGuiaUnitaria.dni_ruc_destino
                                : ""
                            }
                            id="rucDni-envio"
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Provincia</label>
                        </div>
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
                            <option value="">
                              {datosGuiaUnitaria.PROVINCIA
                                ? datosGuiaUnitaria.PROVINCIA
                                : ""}
                            </option>
                          </select>
                        </div>
                        <div className="">
                          <label className=" text-xs">Teléfono</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            disabled
                            type="text"
                            value={
                              datosGuiaUnitaria.telefono_destino
                                ? datosGuiaUnitaria.telefono_destino
                                : ""
                            }
                            id="telefono-envio"
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Distrito</label>
                        </div>
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5 border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
                            <option value="">
                              {datosGuiaUnitaria.DESTINO
                                ? datosGuiaUnitaria.DESTINO
                                : ""}
                            </option>
                          </select>
                        </div>
                        <div className="">
                          <label className=" text-xs">Telefono-Ext</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            disabled
                            type="text"
                            id="telefonoExc-envio"
                            value={
                              datosGuiaUnitaria.telefono_extra_destino
                                ? datosGuiaUnitaria.telefono_extra_destino
                                : ""
                            }
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Direccion</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            disabled
                            type="text"
                            id="telefono-envio"
                            value={
                              datosGuiaUnitaria.direccion_destino
                                ? datosGuiaUnitaria.direccion_destino
                                : ""
                            }
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Referencias</label>
                        </div>
                        <div className="ml-[-60px]">
                          <input
                            disabled
                            type="text"
                            id="direccion-envio"
                            value={
                              datosGuiaUnitaria.referencia_destino
                                ? datosGuiaUnitaria.referencia_destino
                                : ""
                            }
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          />
                        </div>
                      </div>
                      {/* COSTEO DE DESTINO AGENTE */}
                      <div className="grid grid-cols-2 my-4 px-5 mr-2 gap-2">
                        <h2 className=" text-sm  ">Datos de Destino Agente</h2>
                      </div>
                      <div className="grid grid-cols-4 pl-5 gap-0">
                        <div className=" ">
                          <label className=" text-xs ">Nombre-Agente</label>
                        </div>
                        <div className="ml-[-60px]">
                          {/* <SearchAgente
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
                          /> */}
                          {/* <select
                            name="id_agente_despacho_envio"
                            onChange={(e) => {
                              handleSelectAgente(e);
                              handleInputChange(e);
                            }}
                            id="id_agente_despacho_envio"
                            value={selectedAgente}
                            className="w-[90%] border  px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
                            <option value="">Elegir Agente</option>
                            {selectAgentes.map((agente) => (
                              <option key={agente.id} value={agente.id}>
                                {agente.razon_social_proveedor} -{" "}
                                {agente.tipo_servicio_proveedor}
                              </option>
                            ))}
                          </select> */}
                          <Select
                            name="id_agente_despacho_envio"
                            id="id_agente_despacho_envio"
                            styles={customStyles3}
                            options={selectAgentes}
                            onChange={(selectedOption) => {
                              const value = selectedOption.value;
                              handleInputChange(
                                "id_agente_despacho_envio",
                                value
                              );
                              handleSelectAgente(value);
                            }}
                            value={
                              selectedAgente
                                ? selectAgentes.find(
                                    (option) =>
                                      option.value === selectedAgente
                                  )
                                : null
                            }
                            className="border rounded-sm  mt-1 w-[90%] "
                          />
                        </div>
                        <div className="">
                          <label className=" text-xs">Provincia</label>
                        </div>
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
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
                            className="w-[90%] text-xs h-5  border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
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
                        <div className="ml-[-60px]">
                          <select
                            disabled
                            className="w-[90%] text-xs h-5 border  px-1  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          >
                            <option value="">
                              {datosAgente.DESTINO ? datosAgente.DESTINO : ""}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-8 h-5">
                        <button
                          type="submit"
                          className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={ocultarModalAgregarEnvio}
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

export default ModalAgregarEnvio;
