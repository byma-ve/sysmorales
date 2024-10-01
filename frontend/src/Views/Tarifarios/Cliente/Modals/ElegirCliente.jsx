import React, { useState, useEffect } from "react";

function ElegirClienteTarif({ seleccionarCliente }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
        );
        if (!response.ok) {
          throw new Error("Error al obtener datos de la API");
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSeleccionarCliente = (cliente) => {
    seleccionarCliente(cliente);
  };

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.razon_social_cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="z-10 absolute  overflow-y-auto   top-[191px] ml-2 text-left mt-1  rounded-xl shadow w-[350px]  ">
        <input
          type="text"
          placeholder="Elegir cliente"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="w-full ps-4 mb-2 text-sm text-gray-600 border border-gray-300  h-10     font-semibold    bg-white hover:bg-slate-200 
          border-none rounded-xl  outline-none cursor-pointer"
        />
        <ul className=" overflow-y-auto text-sm rounded-xl -mt-1 max-h-[185px] text-gray-600 bg-slate-100 ScrollTableVertical ">
          {clientesFiltrados.length === 0 ? (
            <li className="text-gray-500 py-1 px-2 ">
              No se encontraron clientes
            </li>
          ) : (
            clientesFiltrados.map((cliente, index) => (
              <li
                key={cliente.id}
                className="hover:bg-blue-300 w-full px-3 py-1"
              >
                <div className="   rounded ">
                  <div
                    onClick={() => handleSeleccionarCliente(cliente)}
                    className="w-full py-1 px-1 text-sm font-medium text-gray-900 rounded cursor-pointer"
                  >
                    {cliente.razon_social_cliente}
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
