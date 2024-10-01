import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

import Select from "react-select";

const optionsDOC = [
  { value: "BOLETA", label: "BOLETA" },
  { value: "FACTURA", label: "FACTURA" },
  { value: "RECIBOS POR HONORARIOS", label: "RECIBOS POR HONORARIOS" },
];
function CAgente({
  modalVisible,
  setModalVisible,
  selectedData,
  actualizarTabla,
}) {
  const fileInputRef = useRef(null);

  const ocultarModal = () => {
    setModalVisible(false);
    fileInputRef.current.value = "";
    setPdfLiquidacion(null);
  };

  const [formValues, setFormValues] = useState({
    nombre_agente: "",
    num_manifiesto_liquidacion_agente: "",
    id_agente_despacho_envio: "",
    num_documento_liquidacion_agente: "",
    tipo_documento_liquidacion_agente: "",
    estado_documento_liquidacion_agente: "",
  });

  const [pdfLiquidacion, setPdfLiquidacion] = useState(null);

  useEffect(() => {
    setFormValues({
      nombre_agente: selectedData?.agente || "",
      num_manifiesto_liquidacion_agente: selectedData?.num_manifiesto || "",
      id_agente_despacho_envio: selectedData?.id_agente_despacho_envio || "",
      num_documento_liquidacion_agente:
        selectedData?.num_documento_liquidacion_agente || "",
      tipo_documento_liquidacion_agente:
        selectedData?.tipo_documento_liquidacion_agente || "",
      estado_documento_liquidacion_agente:
        selectedData?.estado_documento_liquidacion_agente || "",
    });
  }, [selectedData, modalVisible]);

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      tipo_documento_liquidacion_agente: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setPdfLiquidacion(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append("nombre_agente", formValues.nombre_agente);
    formDataWithImage.append(
      "num_manifiesto_liquidacion_agente",
      formValues.num_manifiesto_liquidacion_agente
    );
    formDataWithImage.append(
      "id_agente_liquidacion_agente",
      formValues.id_agente_despacho_envio
    );
    formDataWithImage.append(
      "num_documento_liquidacion_agente",
      formValues.num_documento_liquidacion_agente
    );
    formDataWithImage.append(
      "tipo_documento_liquidacion_agente",
      formValues.tipo_documento_liquidacion_agente
    );
    formDataWithImage.append(
      "estado_documento_liquidacion_agente",
      formValues.estado_documento_liquidacion_agente
    );
    formDataWithImage.append("pdf_liquidacion_agente", pdfLiquidacion);

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
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Liquidacion/LiquidacionAgente/guardarLiquidacionAgente.php",
        {
          method: "POST",
          body: formDataWithImage,
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
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
    ocultarModal();
    actualizarTabla();
  };

  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "5px",
      height: "16px",
      borderBottom: "2px solid #9ca3af",
      boxShadow: "none",
      "&:active": {
        borderColor: "#0389fb ",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "10px 0",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "45px",
    }),

    menu: (provided) => ({
      ...provided,
      marginTop: "5px",
      borderRadius: "4px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      borderRadius: "5px",
    }),
  };
  return (
    <>
      {/* cuando le de a cancelar display: none */}
      <div
        className={`side-panel-container ${
          modalVisible ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10`}
      >
        {/* cuando le de a cancelar translate-x-[100%] */}
        <div
          className={`side-panel-cont-container ${
            modalVisible ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[500px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 `}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 p-0">
            <div className="side-panel-iframe relative w-full h-full">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-2 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Completar</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="text-black"
                      >
                        <div className="relative  w-full mb-6 group ">
                          <Select
                            onChange={handleSelectChange}
                            placeholder="Tipo Doc."
                            styles={customStyles2}
                            options={optionsDOC}
                            value={
                              formValues.tipo_documento_liquidacion_agente
                                ? optionsDOC.find(
                                    (option) =>
                                      option.value === formValues.tipo_documento_liquidacion_agente
                                  )
                                : null
                            }
                            required
                            name="tipo_documento_liquidacion_agente"
                            id="tipo_documento_liquidacion_agente"
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo de Documento
                          </label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-6 group ">
                          <input
                            type="text"
                            name="tipo_documento_liquidacion_agente"
                            id="tipo_documento_liquidacion_agente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.tipo_documento_liquidacion_agente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo de Documento
                          </label>
                        </div> */}
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="num_documento_liquidacion_agente"
                            id="num_documento_liquidacion_agente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.num_documento_liquidacion_agente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            N° Documento
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="file"
                            name="pdf_liquidacion_agente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            accept=".pdf"
                            ref={fileInputRef}
                            onChange={handleChange}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Documento PDF
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="estado_documento_liquidacion_agente"
                            id="estado_documento_liquidacion_agente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={
                              formValues.estado_documento_liquidacion_agente
                            }
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Estado Documento
                          </label>
                        </div>
                        <div className="flex items-center justify-end rounded-b mt-7">
                          <button
                            type="submit"
                            className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={ocultarModal}
                            type="button"
                            className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CAgente;
