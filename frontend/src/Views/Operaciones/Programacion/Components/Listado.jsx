import { useState, useEffect } from "react";

function Listado({ programaciones, onSelectChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProgramaciones, setFilteredProgramaciones] =
    useState(programaciones);

  useEffect(() => {
    const results = programaciones.filter((programacion) =>
      `${programacion.id_orden_servicio} - ${programacion.razon_social_cliente}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredProgramaciones(results);
  }, [searchTerm, programaciones]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="Lista Envios h-full max-h-[15rem] ">
        <div className="side-panel-iframe   ">
          <div className="side-panel-iframe  rounded-md  ">
            <div className="side-panel bg-[#fff]     rounded-xl  ">
              <div className="side-cont-titulo  uppercase font-semibold text-white">
                <div className="side-titulo ">
                  <h1 className="side-txt py-2 px-3 mb-2 bg-blue-400 rounded-t-xl ">
                    Lista de Programaciones
                  </h1>
                </div>
              </div>
              <div className="section-crm mx-5    ">
                <input
                  className="w-full ps-1 text-gray-400  text-sm  border rounded-sm  focus:outline-none focus:ring-2 ring-1 focus:border-blue-500  "
                  placeholder="Buscar.."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <select
                  multiple
                  id="listado_programaciones"
                  name="listado_programaciones"
                  className="w-full ScrollTableVertical ps-1 py-1 bg-white border mx-auto my-4 focus:outline-none focus:ring-2 
                  h-[15rem]  text-sm ring-1 overflow-y-auto text-gray-400  "
                  onChange={onSelectChange}
                >
                  {filteredProgramaciones.map((programacion) => (
                    <option
                      className=""
                      key={programacion.id_orden_servicio}
                      value={programacion.id_orden_servicio}
                    >
                      {programacion.id_orden_servicio} -{" "}
                      {programacion.razon_social_cliente}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Listado;
