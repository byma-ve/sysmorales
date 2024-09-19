import { useState, useEffect } from "react";
import { sticker, pdf9x21 } from "./PDFGenerador";

function ModalImprimir({ modalVisible1, setModalVisible1 }) {
  const [registrosCarga, setRegistrosCarga] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  useEffect(() => {
    if (fechaSeleccionada != "") {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroCarga/obtenerRegistrosImprimir.php?fecha=${fechaSeleccionada}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRegistrosCarga(data);
        })
        .catch((error) => console.error("Error al obtener los datos:", error));
    }
  }, [fechaSeleccionada]);

  const ocultarModal1 = () => {
    setOpcionImprimir(null);
    const checkboxMasivoElement = document.querySelector(".checkbox-masivo");
    checkboxMasivoElement.checked = false;
    setCheckboxSeleccionados([]);
    setRegistrosCarga([]);
    setFechaSeleccionada("");
    setInputValues({});
    setModalVisible1(false);
  };

  const handleFechaChange = (event) => {
    const fecha = event.target.value;
    setFechaSeleccionada(fecha);
    setCheckboxSeleccionados([]);
    const checkboxMasivoElement = document.querySelector(".checkbox-masivo");
    checkboxMasivoElement.checked = false;
  };

  const [opcionImprimir, setOpcionImprimir] = useState(null);

  const [checkboxSeleccionados, setCheckboxSeleccionados] = useState([]);

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    const updatedCheckboxSeleccionados = isChecked
      ? [...checkboxSeleccionados, id]
      : checkboxSeleccionados.filter((item) => item !== id);
    setCheckboxSeleccionados(updatedCheckboxSeleccionados);

    if (!isChecked) {
      setInputValues((prevValues) => ({
        ...prevValues,
        [id]: "",
      }));
    }
    const todosSeleccionados = registrosCarga.every((item) =>
      updatedCheckboxSeleccionados.includes(item.id_num_guia_registro_carga)
    );
    const checkboxMasivoElement = document.querySelector(".checkbox-masivo");
    if (checkboxMasivoElement) {
      checkboxMasivoElement.checked = todosSeleccionados;
    }
  };

  const handleCheckboxMasivoChange = (event) => {
    if (event.target.checked) {
      setCheckboxSeleccionados(
        registrosCarga.map((item) => item.id_num_guia_registro_carga)
      );
    } else {
      setCheckboxSeleccionados([]);
    }
  };

  const hayCheckboxSeleccionados = checkboxSeleccionados.length > 0;

  const [inputValues, setInputValues] = useState({});
  const handleInputChange = (event, id) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: event.target.value,
    }));
  };

  const handleGuardar = () => {
    const checkboxSeleccionadosConValores = checkboxSeleccionados.map((id) => ({
      id,
      value: inputValues[id] || 1,
    }));

    if (opcionImprimir == "10x7.5") {
      checkboxSeleccionadosConValores.forEach(async (item) => {
        await sticker(item.value, item.id, fechaSeleccionada);
      });
    } else {
      checkboxSeleccionadosConValores.forEach(async (item) => {
        await pdf9x21(item.value, item.id, fechaSeleccionada);
      });
    }
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalVisible1 ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalVisible1 ? "translate-y-0" : "translate-y-[600%]"
          } w-[45%] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-3">
            <div className="side-panel-iframe h-full ">
              <div className="side-panel bg-white  h-full w-auto m-0 rounded-md">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">Imprimir Guia</div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container ">
                    <div className="py-2 items-center ">
                      <div className="flex justify-between ">
                        <div className="">
                          <input
                            type="date"
                            className="rounded pl-1 text-gray-700 text-sm  border  focus:outline-none focus:ring-2 ring-1 focus:border-blue-400  "
                            onChange={handleFechaChange}
                            value={fechaSeleccionada}
                          />
                        </div>
                        <div
                          className=""
                          onClick={() =>
                            setOpcionImprimir(
                              opcionImprimir === "10x7.5" ? null : "10x7.5"
                            )
                          }
                        >
                          <input
                            type="checkbox"
                            className={`mr-2 ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!fechaSeleccionada}
                            checked={opcionImprimir === "10x7.5"}
                          />
                          <label
                            htmlFor=""
                            className={`text-gray-700 text-sm ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Guia 10x7.5
                          </label>
                        </div>
                        <div
                          className=""
                          onClick={() =>
                            setOpcionImprimir(
                              opcionImprimir === "9.9x21" ? null : "9.9x21"
                            )
                          }
                        >
                          <input
                            type="checkbox"
                            className={`mr-2 ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!fechaSeleccionada}
                            checked={opcionImprimir === "9.9x21"}
                          />
                          <label
                            htmlFor=""
                            className={`text-gray-700 text-sm ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Guia 9.9x21
                          </label>
                        </div>
                        <div className="">
                          <input
                            type="checkbox"
                            disabled={!fechaSeleccionada || registrosCarga == 0}
                            className={`checkbox-masivo rounded text-gray-700 text-sm ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onChange={handleCheckboxMasivoChange}
                          />
                          <label
                            htmlFor=""
                            className={`ml-2 text-gray-700 text-sm ${
                              !fechaSeleccionada
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            } `}
                          >
                            Elegir Todos
                          </label>
                          {/* <input
                            type="text"
                            className={`items-center ps-1 ml-2 outline-none w-[26px] focus:bg-gray-200 text-[12px] bg-gray-100  h-4 border  rounded-sm text-gray-400  ${!fechaSeleccionada ? "opacity-50 cursor-not-allowed" : ""} `}
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div
                      id="countries_multiple"
                      className="bg-white pl-1 pt-8 border mx-auto my-1 focus:outline-none focus:ring-2 overflow-y ScrollTable overflow-ellipsis text-sm ring-1 rounded text-gray-400 cont-checkbox-items w-full h-full grid grid-cols-3 gap-1 place-content-center max-h-52 overflow-y-auto "
                    >
                      {registrosCarga.map((estado) => (
                        <div
                          key={estado.id}
                          className="checkbox-item flex items-center p-3"
                        >
                          <input
                            type="checkbox"
                            className="checkitem"
                            checked={checkboxSeleccionados.includes(
                              estado.id_num_guia_registro_carga
                            )}
                            onChange={(event) =>
                              handleCheckboxChange(
                                event,
                                estado.id_num_guia_registro_carga
                              )
                            }
                          />
                          <label
                            htmlFor="countries_multiple"
                            className="pl-1 w-[70%] xl:w-[60%] text-gray-400"
                          >
                            {estado.id_num_guia_registro_carga}
                          </label>
                          <input
                            type="text"
                            className="items-center ps-1 outline-none w-[26px] bg-gray-100 focus:bg-gray-300 h-4 ml-1 border text-[12px] rounded-sm text-gray-400"
                            value={
                              inputValues[estado.id_num_guia_registro_carga] ||
                              ""
                            }
                            onChange={(event) =>
                              handleInputChange(
                                event,
                                estado.id_num_guia_registro_carga
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end mt-8 h-4">
                      <button
                        onClick={() => {
                          handleGuardar();
                          ocultarModal1();
                        }}
                        type="button"
                        disabled={!hayCheckboxSeleccionados || !opcionImprimir}
                        className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          ocultarModal1();
                        }}
                        type="button"
                        className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 "
                      >
                        Cancelar
                      </button>
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

export default ModalImprimir;
