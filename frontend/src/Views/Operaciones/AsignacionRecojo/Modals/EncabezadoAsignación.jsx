import { useState } from "react";
const EncabRecojo = [
  "O. Servicio",
  "Fecha Recojo",
  "Hora Recojo",
  "Cliente",
  "Area",
  "Departamento",
  "Provincia",
  "Distrito",
  "Direccion",
  "Referencias",
  "Contacto Recojo",
  "Telefono",
  "Descripcion Mercancia",
  "Cant Bultos",
  "Peso Mercancia",
  "Peso Volumen",
  "Metros Cubicos",
  "Razon Social Proveedor",
  "DNI Conductor",
  "Conductor",
  "DNI Auxiliar",
  "Auxiliar",
];

function EncabezadoAsignacion({
  modalEncabezados,
  setModalEncabezados,
  onGuardarColumnas,
}) {
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState(() => {
    const initialState = {};
    EncabRecojo.forEach((header) => {
      initialState[header] = true;
    });
    return initialState;
  });

  // Estado intermedio para reversión
  const [columnasPrevias, setColumnasPrevias] = useState(columnasSeleccionadas);

  const toggleColumna = (columna) => {
    setColumnasSeleccionadas((prev) => ({
      ...prev,
      [columna]: !prev[columna],
    }));
  };

  const guardarCambiosModal = () => {
    onGuardarColumnas(columnasSeleccionadas);
    setModalEncabezados(false);
    setColumnasPrevias(columnasSeleccionadas);
  };

  const cancelarCambiosModal = () => {
    setModalEncabezados(false);
    setColumnasSeleccionadas(columnasPrevias);
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalEncabezados ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalEncabezados ? "translate-y-0" : "translate-y-[600%]"
          } w-[750px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4 ">
            <div className="side-panel-iframe h-full">
              <div className="side-panel bg-white   h-full w-auto m-0 rounded-md">
                <div className="side-cont-titulo mb-6 text-[25px] px-5 py-2 rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Vistas de Encabezados</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container">
                    <div className="grid grid-cols-[1fr,1fr,1fr] justify-between px-6 ">
                      {EncabRecojo.map((header, index) => (
                        <div key={index} className="mb-6 mr-2 text-justify">
                          <input
                            type="checkbox"
                            name={header}
                            className="mr-2 h-4 w-4"
                            checked={columnasSeleccionadas[header]}
                            onChange={() => toggleColumna(header)}
                          />
                          <label htmlFor={header} className="text-black">
                            {header}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end   mt-6">
                      <button
                        onClick={guardarCambiosModal}
                        type="button"
                        className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelarCambiosModal}
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

export default EncabezadoAsignacion;
