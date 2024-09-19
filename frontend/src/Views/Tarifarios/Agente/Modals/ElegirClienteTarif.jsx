import React, { useState, useEffect } from "react";

function ElegirClienteTarif({ seleccionarCliente }) {
  const [agentes, setAgentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_agentes.php"
        );
        if (!response.ok) {
          throw new Error("Error al obtener datos de la API");
        }
        const data = await response.json();
        setAgentes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSeleccionarCliente = (agente) => {
    seleccionarCliente(agente);
  };

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const agentesFiltrados = agentes.filter((agente) =>
    agente.razon_social_proveedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="z-10 absolute  overflow-y-auto   top-[191px] ml-2 text-left mt-1  rounded-xl shadow w-[350px]  ">
        <input
          type="text"
          placeholder="Elegir Agente"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="w-full ps-4 mb-2 text-sm text-gray-600 border border-gray-300  h-10     font-semibold    bg-white hover:bg-slate-200 
          border-none rounded-xl  outline-none cursor-pointer"
        />

        <ul className=" overflow-y-auto text-sm rounded-xl -mt-1 max-h-[185px] text-gray-600 bg-slate-100 ScrollTableVertical ">
          {agentesFiltrados.length === 0 ? (
            <li className="text-gray-500 py-1 px-2 ">
              No se encontraron áreas.
            </li>
          ) : (
            agentesFiltrados.map((agente, index) => (
              <li
                key={agente.id}
                className="hover:bg-blue-300 w-full px-3 py-1"
              >
                <div className="   rounded ">
                  <div
                    onClick={() => handleSeleccionarCliente(agente)}
                    className="w-full py-1 px-1 text-sm font-medium text-gray-900 rounded cursor-pointer"
                  >
                    {agente.razon_social_proveedor}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default ElegirClienteTarif;
