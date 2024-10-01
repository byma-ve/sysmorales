import React, { useState, useEffect } from "react";
import SearchConductor from "../Components/SearchConductor";
import Select from "react-select";
import SearchAuxiliar from "../Components/SearchAuxiliar";

import SearchVehiculo from "../Components/SearchVehiculo";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    maxHeight: "23px",
    minHeight: "18px",
    height: "18px",
    fontSize: "12px",
    borderRadius: "5px",
    backgroundColor: "transparent",
    border: "none",
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
    padding: "4px 4px",
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 20px 1px 1px",
    marginTop: "0px",
    marginTop: "-10px",
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    //  display: "none", Oculta el indicador
    marginTop: "-10px",
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta la barrita al lado del indicador
  }),
};
function TrabPropios({ formValues, handleChange }) {
  const [conductores, setConductores] = useState([]);
  const [conductoresEncontrar, setConductoresEncontrar] = useState([]);

  useEffect(() => {
    fetch(
      "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/obtenerConductores.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedConductores = data.map((conductores) => ({
          value: conductores.id,
          label: conductores.dni_usuario,
        }));
        setConductores(transformedConductores);
        setConductoresEncontrar(data);
      })
      .catch((error) => console.error("Error fetching conductores:", error));
  }, []);

  const [auxiliares, setAuxiliares] = useState([]);
  const [auxiliaresEncontrar, setAuxiliaresEncontrar] = useState([]);

  useEffect(() => {
    fetch(
      "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/obtenerAuxiliares.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedAuxiliares = data.map((auxiliar) => ({
          value: auxiliar.id,
          label: auxiliar.dni_usuario,
        }));
        setAuxiliares(transformedAuxiliares);
        setAuxiliaresEncontrar(data);
      })
      .catch((error) => console.error("Error fetching auxiliares:", error));
  }, []);

  const [nombreConductor, setNombreConductor] = useState("");
  const [nombreAuxiliar, setNombreAuxiliar] = useState("");

  useEffect(() => {
    if (formValues.id_conductor_recojo) {
      const selected = conductoresEncontrar.find(
        (p) => p.id === formValues.id_conductor_recojo
      );
      if (selected) {
        fetch(
          `https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/datosConductor.php?id=${selected.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            setNombreConductor(data.colaborador_usuario);
          })
          .catch((error) =>
            console.error("Error fetching datos del conductor:", error)
          );
      }
    } else {
      setNombreConductor("");
    }
  }, [formValues.id_conductor_recojo, conductoresEncontrar]);

  useEffect(() => {
    if (formValues.id_auxiliar_recojo) {
      const selected = auxiliaresEncontrar.find(
        (p) => p.id === formValues.id_auxiliar_recojo
      );
      if (selected) {
        fetch(
          `https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/datosAuxiliar.php?id=${selected.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            setNombreAuxiliar(data.colaborador_usuario);
          })
          .catch((error) =>
            console.error("Error fetching datos del auxiliar:", error)
          );
      }
    } else {
      setNombreAuxiliar("");
    }
  }, [formValues.id_auxiliar_recojo, auxiliaresEncontrar]);

  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    fetch(
      "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Vehiculo/obtener_vehiculos.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedVehiculos = data.map((vehiculo) => ({
          value: vehiculo.id,
          label: vehiculo.placa_vehiculo,
        }));
        setVehiculos(transformedVehiculos);
      })
      .catch((error) => console.error("Error fetching vehiculos:", error));
  }, []);

  const handleVehiculoChange = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    handleChange({
      target: {
        name: "id_vehiculo_recojo",
        value: vehiculo ? vehiculo.id : "",
      },
    });
  };
  return (
    <>
      {/* DATOS DE LOS TRABAJADORES PROPIOS */}
      <form className="mb-1 text-black">
        <div className="grid grid-cols-2   px-4  mr-2  gap-2 mb-2">
          <h1 className="text-black text-sm  ">Datos Trabajadores Propios:</h1>
        </div>
        <div className="grid grid-cols-4 pl-5 gap-0">
          <div className=" ">
            <label className=" text-xs ">DNI Conductor:</label>
          </div>
          <div className="ml-[-65px]">
            {/* <SearchConductor
              conductores={conductores}
              setSelectedConductor={handleConductorChange}
              selectedConductorId={formValues.id_conductor_recojo}
            /> */}
            <div className="border w-[90%] bg-gray-100 mt-1">
              <Select
                styles={customStyles}
                options={conductores}
                value={
                  formValues.id_conductor_recojo
                    ? conductores.find(
                        (option) =>
                          option.value === formValues.id_conductor_recojo
                      )
                    : null
                }
                onChange={(conductor) => {
                  handleChange({
                    target: {
                      name: "id_conductor_recojo",
                      value: conductor ? conductor.value : "",
                    },
                  });
                }}
                placeholder="Seleccione un conductor"
              />
            </div>
          </div>
          <div className="">
            <label className=" text-xs">DNI Auxiliar:</label>
          </div>
          <div className="ml-[-85px]">
            {/* <SearchAuxiliar
              auxiliares={auxiliares}
              setSelectedAuxiliar={handleAuxiliarChange}
              selectedAuxiliarId={formValues.id_auxiliar_recojo}
            /> */}
            <div className="border w-[90%] bg-gray-100 mt-1">
              <Select
                styles={customStyles}
                options={auxiliares}
                value={
                  formValues.id_auxiliar_recojo
                    ? auxiliares.find(
                        (option) =>
                          option.value === formValues.id_auxiliar_recojo
                      )
                    : null
                }
                onChange={(auxiliar) => {
                  handleChange({
                    target: {
                      name: "id_auxiliar_recojo",
                      value: auxiliar ? auxiliar.value : "",
                    },
                  });
                }}
                placeholder="Seleccione un auxiliar"
              />
            </div>
          </div>
          <div className="">
            <label className=" text-xs">Conductor:</label>
          </div>
          <div className="ml-[-65px]">
            <input
              type="text"
              id="nombre-conductor-propio"
              readOnly
              value={nombreConductor}
              className="w-[90%] pl-1 text-xs bg-gray-100 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">Auxiliar:</label>
          </div>
          <div className="ml-[-85px]">
            <input
              type="text"
              id="conductor-auxiliar-propio"
              readOnly
              value={nombreAuxiliar}
              className="w-[90%] pl-1 text-xs bg-gray-100 px-1 rounded-sm border focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-2   px-4  mr-2  gap-2 mb-2">
          <h1 className="text-black text-sm  ">Datos de vehiculos:</h1>
        </div>
        <div className="grid grid-cols-4 pl-5 gap-0">
          <div className=" ">
            <label className=" text-xs ">Vehiculo:</label>
          </div>
          <div className="ml-[-65px]">
            {/* <SearchVehiculo
              conductores={conductores}
              setSelectedConductor={handleConductorChange}
              selectedConductorId={formValues.id_conductor_recojo}
            /> */}
            <div className="border w-[90%] bg-gray-100 mt-1">
              <Select
                styles={customStyles}
                options={vehiculos}
                value={
                  formValues.id_vehiculo_recojo
                    ? vehiculos.find(
                        (option) =>
                          option.value === formValues.id_vehiculo_recojo
                      )
                    : null
                }
                onChange={(vehiculo) => {
                  handleChange({
                    target: {
                      name: "id_vehiculo_recojo",
                      value: vehiculo ? vehiculo.value : "",
                    },
                  });
                }}
                placeholder="Seleccione un Vehiculo"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default TrabPropios;
