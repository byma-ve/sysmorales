import { useState } from "react";
const EncabSeguimiento = [
  "Estado Final",
  "O. SERVICIO",
  "N° Guia",
  "RUC/DNI",
  "Cliente",
  "Fecha Recojo",
  "Hora Recojo",
  "Area",
  "Contacto Recojo",
  "Depart. Origen",
  "Provincia Origen",
  "Distrito Origen",
  "Direccion Recojo",
  "Referencia Recojo",
  "Estado Recojo",
  "Comentario Recojo",
  "Imagen Recojo",
  "Fecha Registro",
  "RUC/DNI",
  "Consignado",
  "Telefono",
  "Telefono Opcional",
  "Departamento Destino",
  "Provincia Destino",
  "Distrito Destino",
  "Direccion Destino",
  "Referencia Destino",
  "Proceso",
  "Estado Mercancia",
  "Comentario Registro",
  "Guia Transportista",
  "Guia Remision",
  "Documento Adicioanl(1)",
  "Documento Adicioanl(2)",
  "Fecha Despacho",
  "Procesos",
  "Estado Mercancias",
  "Comentario Despacho",
  "Numero Manifiesto",
  "Proveedor Transportista",
  "Proveedor Agente",
  "Proceso Primer Intento",
  "Fecha Primer Intento",
  "Estado Primer Intento",
  "Comen. Primer Intento",
  "Imagen Primer Intento",
  "Proceso Segundo Intento",
  "Fecha Segundo Intento",
  "Estado Segundo Intento",
  "Comen. Segundo Intento",
  "Imagen Segundo Intento",
  "Proceso Tercer Intento",
  "Fecha Tercer Intento",
  "Estado Tercer Intento",
  "Comen. Tercer Intento",
  "Imagen Tercer Intento",
  "Tipo Envio",
  "Tipo Logistica",
  "Contenido Mercancia",
  "Cantidad Bultos",
  "Peso Mercancia",
  "Peso Volumen",
  "Metros Cubicos",
  "T Operacion",
  "T Max. Entrega",
  "TT IND",
];

export const EncabezadosSeguimiento = ({
  modalEncabezados,
  setModalEncabezados,
  onGuardarColumnas,
}) => {
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState(() => {
    const initialState = {};
    EncabSeguimiento.forEach((header) => {
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
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center `}
      >
        <div
          className={`side-panel-cont-container ${
            modalEncabezados ? "translate-y-0" : "translate-y-[600%]"
          } w-[850px]  block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4 ">
            <div className="side-panel-iframe h-full">
              <div className="side-panel bg-white  h-full w-auto m-0 rounded-md">
                <div className="side-cont-titulo mb-6 text-[25px] px-5 py-2 rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo flex w-full">
                    <h1 className="side-txt mr-4 w-full">
                      Vistas de Encabezados
                    </h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container">
                    <div className="flex flex-col px-6 w-full h-[210px] overflow-hidden overflow-y-scroll">
                      {EncabSeguimiento.map((header, index) => (
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
};
