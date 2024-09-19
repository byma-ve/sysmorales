import React, { useState, useEffect } from "react";
import SearchConductor from "../Components/SearchConductor";
import SearchAuxiliar from "../Components/SearchAuxiliar";

function TrabPropios({ formValues, handleChange }) {
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtenerConductores.php"
    )
      .then((response) => response.json())
      .then((data) => setConductores(data))
      .catch((error) => console.error("Error fetching conductores:", error));
  }, []);

  const [auxiliares, setAuxiliares] = useState([]);
  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtenerAuxiliares.php"
    )
      .then((response) => response.json())
      .then((data) => setAuxiliares(data))
      .catch((error) => console.error("Error fetching auxiliares:", error));
  }, []);

  const [selectedConductor, setSelectedConductor] = useState(null);
  const [selectedAuxiliar, setSelectedAuxiliar] = useState(null);

  const [nombreConductor, setNombreConductor] = useState("");
  const [nombreAuxiliar, setNombreAuxiliar] = useState("");
  
  const handleConductorChange = (conductor) => {
    setSelectedConductor(conductor);
    handleChange({
      target: {
        name: "id_conductor_recojo",
        value: conductor ? conductor.id : "",
      },
    });
    // Obtener el nombre del conductor seleccionado
    if (conductor) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/datosConductor.php?id=${conductor.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setNombreConductor(data.colaborador_usuario);
        })
        .catch((error) =>
          console.error("Error fetching datos del conductor:", error)
        );
    } else {
      setNombreConductor("");
      setSelectedConductor("");
    }
  };

  const handleAuxiliarChange = (auxiliar) => {
    setSelectedAuxiliar(auxiliar);
    handleChange({
      target: {
        name: "id_auxiliar_recojo",
        value: auxiliar ? auxiliar.id : "",
      },
    });

    if (auxiliar) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/datosAuxiliar.php?id=${auxiliar.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setNombreAuxiliar(data.colaborador_usuario);
        })
        .catch((error) =>
          console.error("Error fetching datos del auxiliar:", error)
        );
    } else {
      setNombreAuxiliar("");
      setNombreAuxiliar("");
    }
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
            <SearchConductor
              conductores={conductores}
              setSelectedConductor={handleConductorChange}
              selectedConductorId={formValues.id_conductor_recojo}
            />
          </div>
          <div className="">
            <label className=" text-xs">DNI Auxiliar:</label>
          </div>
          <div className="ml-[-85px]">
            <SearchAuxiliar
              auxiliares={auxiliares}
              setSelectedAuxiliar={handleAuxiliarChange}
              selectedAuxiliarId={formValues.id_auxiliar_recojo}
            />
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
      </form>
    </>
  );
}

export default TrabPropios;
