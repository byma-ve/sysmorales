import { useState, useEffect } from "react";

export const ListaEnvios = ({
  opcionesRegistro,
  onSelectChange,
  setOpcionesBuscadas,
}) => {
  const [filtroId, setFiltroId] = useState("");
  const [enviosFiltrados, setEnviosFiltrados] = useState(opcionesRegistro);

  useEffect(() => {
    const enviosFiltrados = opcionesRegistro.filter((envio) =>
      envio.id_orden_servicio_estado_recojo.includes(filtroId)
    );
    setEnviosFiltrados(enviosFiltrados);
  }, [filtroId, opcionesRegistro]);

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setFiltroId(valor);

    if (valor.trim() !== "") {
      setOpcionesBuscadas(
        opcionesRegistro.filter((envio) =>
          envio.id_orden_servicio_estado_recojo.includes(valor)
        )
      );
    } else {
      setOpcionesBuscadas([]);
    }
  };

  return (
    <>
      <div className="Lista Envios h-full ">
        <div className="side-panel-iframe  ">
          <div className="side-panel-iframe  rounded-md  ">
            <div className="side-panel bg-[#fff]     rounded-xl  ">
              <div className="side-cont-titulo  uppercase font-semibold text-white">
                <div className="side-titulo ">
                  <h1 className="side-txt py-2 px-5 mb-2 bg-blue-400 rounded-t-xl">
                    Lista de Envios
                  </h1>
                </div>
              </div>
              <div className="section-crm mx-5   ">
                {/* Input para la búsqueda */}
                <input
                  className="w-full pl-1 text-gray-600 font-semibold  text-sm  border rounded-sm  focus:outline-none focus:ring-2 ring-1 focus:border-blue-500  "
                  placeholder="Buscar.."
                  value={filtroId}
                  onChange={handleInputChange}
                />
                <select
                  multiple
                  id="countries_multiple"
                  onChange={onSelectChange}
                  className="ScrollTableVertical overflow-y-auto pl-1 pt-1 bg-white border  my-3 focus:outline-none focus:ring-2 h-[42rem] w-full   text-sm ring-1  text-gray-600 font-semibold"
                >
                  {/* Renderizar opciones filtradas */}
                  {enviosFiltrados.map((registro) => (
                    <option
                      key={`${registro.id_orden_servicio_estado_recojo}/${registro.id_destino}`}
                      value={`${registro.id_orden_servicio_estado_recojo}/${registro.id_destino}`}
                    >
                      {registro.id_num_guia_registro_carga
                        ? `${registro.DESTINO} - ${registro.id_num_guia_registro_carga}`
                        : registro.DESTINO}
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
};
