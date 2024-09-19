export const ModalAgente = ({ modalAgente, setModalAgente, datosAgentesModal }) => {
  // Oculta el modal
  const ocultarAgente = () => {
    setModalAgente(false);
  };

  return (
    <>
      <div
        className={`side-panel-container ${modalAgente ? "visible" : "invisible"
          } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${modalAgente ? "translate-y-0" : "translate-y-[250%]"
            } w-[500px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4 ">
            <div className="side-panel-iframe h-full">
              <div className="side-panel bg-white   h-full w-auto m-0 rounded-md">
                <div className="side-cont-titulo mb-6 text-[25px] px-5 py-2 rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo">
                    <h1 className="side-txt">N° Guias Manifiesto</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <div className=" card-container">
                    <div className="relative overflow-auto ScrollTableVertical max-h-64  rounded-lg">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead className="text-md bg-slate-100 border-b-2 ">
                          <tr>
                            <th scope="col" className="px-6 py-2">
                              N° Guia
                            </th>
                            <th scope="col" className="px-6 py-2">
                              Agente
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-md bg-slate-100 ">
                          {datosAgentesModal.map((datosAgentesModal) => (
                            <tr className="border-b-2 ">
                              <th
                                scope="row"
                                className="px-6 py-3 font-medium   "
                              >
                                {datosAgentesModal.id_num_guia_despacho_envio}

                              </th>
                              <td className="px-6 py-3">{datosAgentesModal.razon_social_proveedor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-end   mt-6">
                      <button
                        onClick={ocultarAgente}
                        type="button"
                        className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 "
                      >
                        Cerrar
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
