import React, { useState, useEffect } from "react";
import Select from "react-select";

function DatosRemitente({ onClienteElegido, onAreaElegida }) {
  const [clienteElegido, setClienteElegido] = useState("");
  const [areaElegida, setAreaElegida] = useState("");
  const [optionsClientes, setOptionsClientes] = useState([]);
  const [optionsAreas, setOptionsAreas] = useState([""]);
  // Cargar los datos del cliente al montar el componente
  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Cliente/obtenerClientesTarifarios.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((option) => ({
          value: option.id,
          label: option.razon_social_cliente,
        }));
        setOptionsClientes(formattedOptions);
      })
      .catch((error) => {
        console.error("Error al obtener las opciones:", error);
      });
  }, []);

  // Cargar los datos de las áreas cuando se elige un cliente
  useEffect(() => {
    if (clienteElegido) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/obtenerAreasTarifario.php?id_cliente=${clienteElegido}`
      )
        .then((response) => response.json())
        .then((data) => {
          const formattedAreas = data.map((area) => ({
            value: area.id,
            label: area.nombre_area,
          }));
          setOptionsAreas(formattedAreas);
        })
        .catch((error) => {
          console.error("Error al obtener las áreas:", error);
        });
    }
  }, [clienteElegido]);

  const handleClienteChange = (selectedCliente) => {
    setClienteElegido(selectedCliente ? selectedCliente.value : null);
    if (!selectedCliente.value) {
      setOptionsAreas([]);
    }
    onAreaElegida(null);
    setAreaElegida(null);
    onClienteElegido(selectedCliente ? selectedCliente.value : null);
  };

  const handleAreaChange = (selectedArea) => {
    setAreaElegida(selectedArea.value);
    onAreaElegida(selectedArea.value);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      height: "10px",
      fontSize: "16px",
      borderRadius: "10px",
      backgroundColor: "transparent",
      border: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
      fontSize: "14px",
      margin: "6px 0",
      padding: "8px 0px",
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: "5px",
      padding: "4px 12px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
dropdownIndicator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta el indicador
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta la barrita al lado del indicador
    }),
  };

  return (
    <>
      <div className="datos-remitente rounded-md ">
        <div className="side-panel bg-[#fff] rounded-2xl">
          <div className="side-cont-titulo  text-[18px] font-semibold text-[#535c69]">
            <div className="side-titulo ">
              <h1 className="side-txt text-white py-2 px-5  bg-blue-400 rounded-t-xl">
                Datos del Cliente
              </h1>
            </div>
          </div>
          <div className="section-crm ">
            <div className="card-container">
              <div className="flex px-5">
                <div className="cont-elegir-cliente mt-2 flex flex-col w-full">
                  <label>Elegir Cliente:</label>
                  <Select
                    options={optionsClientes}
                    styles={customStyles}
                    placeholder="Selecciona un cliente"
                    onChange={handleClienteChange}
                    className="react-select-container w-full  my-2 -py-4 bg-gray-100  rounded-lg focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="flex px-5">
                <div className="cont-elegir-area flex flex-col w-full mb-2">
                  <label>Elegir Área:</label>
                  <Select
                    options={optionsAreas}
                    styles={customStyles}
                    placeholder="Selecciona un área"
                    onChange={handleAreaChange}
                    className="react-select-container w-full  my-2 -py-4 bg-gray-100  rounded-lg focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                    classNamePrefix="react-select"
                    value={
                      areaElegida !== null && areaElegida !== undefined
                        ? optionsAreas.find(
                            (option) => option.value === areaElegida
                          )
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DatosRemitente;
