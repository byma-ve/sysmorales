import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

import Select from "react-select";

const optionsDOC = [
  { value: "CARGO FISICO CUSTODIA", label: "CARGO FISICO CUSTODIA" },
  { value: "CARGO FISICO ENTREGADO", label: "CARGO FISICO ENTREGADO" },
];
function CAgente({
  modalVisible,
  setModalVisible,
  selectedData,
  actualizarTabla,
}) {
  const ocultarModal = () => {
    setModalVisible(false);
  };

  const [formValues, setFormValues] = useState({
    guia_tracking: "",
    tipo_cargo: "",
    fecha_referencia: "",
    observaciones: "",
  });

  useEffect(() => {
    setFormValues({
      guia_tracking: selectedData?.guia_tracking || "",
      tipo_cargo: selectedData?.tipo_cargo_registro_carga || "",
      fecha_referencia: selectedData?.fecha_referencia_registro_carga || "",
      observaciones: selectedData?.observaciones_registro_carga || "",
    });
  }, [selectedData, modalVisible]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar el modal de carga
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "transparent",
      html: `
        <div class="papapa"> 
          <div class="loader1"> 
            <h1 class="guardado">Guardando...</h1>
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
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/Seguimiento/guardarSeguimiento.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        await Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        ocultarModal();
        actualizarTabla();
      } else {
        await Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      console.log(responseData.datos);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      await Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
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

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      tipo_cargo: value,
    }));
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
                      <form onSubmit={handleSubmit} className="text-black">
                        <div className="relative  w-full mb-6 group ">
                          <Select
                            placeholder="Tipo Cargo"
                            styles={customStyles2}
                            options={optionsDOC}
                            id="tipo_cargo"
                            name="tipo_cargo"
                            required
                            value={
                              formValues.tipo_cargo
                                ? optionsDOC.find(
                                    (option) =>
                                      option.value === formValues.tipo_cargo
                                  )
                                : null
                            }
                            onChange={handleSelectChange}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo de Cargo
                          </label>
                        </div>

                        <div className="relative z-0 w-full  group">
                          <input
                            type="date"
                            name="fecha_referencia"
                            id="fecha_referencia"
                            className=" block py-2 pr-2 w-full text-sm bg-transparent border-0 border-b-[2px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues?.fecha_referencia}
                            onChange={handleChange}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Fecha de referencia
                          </label>
                        </div>
                        <div className="relative z-0 w-full mt-6 mb-6 group">
                          <textarea
                            type="text"
                            name="observaciones"
                            id="observaciones"
                            className="uppercase block py-2.5 px-0 w-full  max-h-[200px] min-h-[40px] overflow-hidden text-sm bg-transparent border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                            value={formValues?.observaciones}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Observaciones
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
