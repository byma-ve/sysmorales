import { agentes } from "../Data/Datos";

function ElegirAgente({ seleccionarAgente }) {
  const handleSeleccionarAgente = (agente) => {
    seleccionarAgente(agente);
  };

  return (
    <>
      <div className="ScrollTableVertical w-[250px] z-10 absolute top-8 bg-slate-100 rounded-lg shadow  h-40 overflow-hidden overflow-y-scroll">
        <ul className="p-3 overflow-y-auto text-sm text-gray-200">
          {agentes.map((agente, index) => (
            <li key={index}>
              <div className="flex items-center ps-2 rounded hover:bg-gray-200">
                <label
                  onClick={() => handleSeleccionarAgente(agente)}
                  className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded cursor-pointer"
                >
                  {agente["N° Manifiesto"]}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ElegirAgente;
