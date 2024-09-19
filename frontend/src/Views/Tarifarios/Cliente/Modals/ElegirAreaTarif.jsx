import React, { useState, useEffect } from "react";

function ElegirAreaTarif({ seleccionarArea, id_cliente }) {
  const [areas, setAreas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (id_cliente) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/obtener_area.php?id_cliente=${encodeURIComponent(
          id_cliente
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAreas(data);
        })
        .catch((error) => {
          console.error("Error al obtener datos del area:", error);
        });
    }
  }, [id_cliente]);

  const handleSeleccionarArea = (area) => {
    seleccionarArea(area);
  };

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const areasFiltrados = areas.filter((area) =>
    area.nombre_area.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="z-10 absolute  overflow-y-auto   top-[191px] ml-2 text-left mt-1  rounded-xl shadow w-[13.8rem]  ">
        <input
          type="text"
          placeholder="Elegir Area"
          value={busqueda}
          onChange={handleBusquedaChange}
          className="w-full ps-4 mb-2 text-sm text-gray-600 border border-gray-300  h-10     font-semibold    bg-white hover:bg-slate-200 
          border-none rounded-xl  outline-none cursor-pointer"
        />

        <ul className="overflow-y-auto text-sm rounded-xl -mt-1 max-h-[185px] text-gray-600 bg-slate-100 ScrollTableVertical">
          {areasFiltrados.length === 0 ? (
            <li className="text-gray-500 py-1 px-2 ">
              No se encontraron áreas.
            </li>
          ) : (
            areasFiltrados.map((area, index) => (
              <li key={area.id} className="hover:bg-blue-300 w-full px-3 py-1">
                <div className="   rounded">
                  <div
                    onClick={() => handleSeleccionarArea(area)}
                    className="w-full py-1 px-1 text-sm font-medium text-gray-900 rounded cursor-pointer"
                  >
                    {area.nombre_area}
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

export default ElegirAreaTarif;
