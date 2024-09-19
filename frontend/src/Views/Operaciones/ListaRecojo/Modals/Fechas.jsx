function Fechas({
  handleFechaDesdeChange,
  handleFechaHastaChange,
  calendarioClickeado,
  setCalendarioClickeado,
}) {
  // Oculta el modal
  const ocultarModalFechas = () => {
    setCalendarioClickeado(false);
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          calendarioClickeado ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex 
        justify-center items-center `}
      >
        <div
          className={`side-panel-cont-container ${
            calendarioClickeado ? "translate-y-0" : "translate-y-[600%]"
          } w-[655px] block absolute transition-transform duration-500 -translate-x-10 `}
        >
          <div className="side-panel-content-container p-4   ">
            <div className="side-panel-iframe h-full w-full">
              <div className="side-panel bg-white  rounded-md h-full w-auto m-0">
                <div className="side-cont-titulo mb-4 text-[25px] px-5 py-2   rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">Agregar </h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className="cont-fecha flex items-center">
                    <span className="mx-4 text-gray-500 text-xl font-semibold ">
                      Desde:
                    </span>
                    <div className="relative z-0 w-full group border border-gray-300">
                      <input
                        type="date"
                        name="recha_req_desde"
                        id="recha_req_desde"
                        className="text-sm outline-none rounded-lg block w-full ps-10 p-2.5 bg-white placeholder-gray-500 text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=""
                        onChange={handleFechaDesdeChange}
                        required
                      />
                    </div>
                    <span className="mx-4 text-gray-500 text-xl font-semibold">
                      Hasta:
                    </span>
                    <div className="relative z-0 w-full group border border-gray-300">
                      <input
                        type="date"
                        name="recha_req_hasta"
                        id="recha_req_hasta"
                        className="text-sm outline-none rounded-lg block w-full ps-10 p-2.5 bg-white placeholder-gray-500 text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=""
                        onChange={handleFechaHastaChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end   mt-6">
                      <button
                        onClick={ocultarModalFechas}
                        type="button"
                        className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={ocultarModalFechas}
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
    </>
  );
}

export default Fechas;
