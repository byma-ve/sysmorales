import React, { useEffect, useState } from 'react';

function AgregarEnvio({ id_cliente, id_area, onFetchData, data, onTipoComprobante }) {
  const [tipoComprobante, setTipoComprobante] = useState('');

  useEffect(() => {
    if (id_cliente && id_area) {
      onFetchData();
    }
  }, [id_cliente, id_area]);

  const handleTipoComprobanteChange = (e) => {
    setTipoComprobante(e.target.value);
    onTipoComprobante(e.target.value);
  };

  return (
    <>
      <div className="CalcularEnvio mt-4 w-[100%] ">
        <div className="side-panel-iframe  mb-1 ">
          <div className="side-panel-iframe  rounded-md  ">
            <div className="side-panel bg-[#fff] rounded-xl  ">
              <div className="side-cont-titulo tracking-wide text-white  text-[18px] font-semibold ">
                <div className="side-titulo ">
                  <h1 className="side-txt py-2 px-5 mb-1 bg-blue-400 rounded-t-xl">
                    Calculo Total
                  </h1>
                </div>
              </div>
              <div className="section-crm ">
                <div className="card-container">
                  <form className="grid grid-cols-[36%,60%]   px-6 text-xs gap-1 mb-1">
                    <div className=" ">
                      <label htmlFor="cotizacion" className="text-black">
                        Costo Envio
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="cotizacion"
                        value={data.total_costo_envio}
                        readOnly
                        className="text-black pl-1 border rounded text-xs  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="cotizacion" className="text-black">
                        Costo adicional
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="precio_total_cotizacion"
                        name='precio_total_cotizacion'
                        value={data.total_costo_adicional}
                        readOnly
                        className="text-black pl-1 border rounded text-xs  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="rucDni" className="text-black">
                        Sub Total
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="sub_total_cotizacion"
                        name='sub_total_cotizacion'
                        readOnly
                        value={data.sub_total}
                        className="text-black pl-1 border rounded text-xs  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="contacto" className="text-black">
                        IGV 1.18%
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="igv_cotizacion"
                        name='igv_cotizacion'
                        readOnly
                        value={data.igv_1_18}
                        className="text-black pl-1 border rounded text-xs  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="direccion" className="text-black">
                        Total
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="precio_total_cotizacion"
                        name='precio_total_cotizacion'
                        readOnly
                        value={data.total_calculo}
                        className="text-black pl-1 border rounded text-xs h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label htmlFor="departamento" className="text-black">
                        Precio Total
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="contacto"
                        readOnly
                        value={data.total_calculo}
                        className="text-black pl-1 border rounded text-xs  h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="boleta"
                        className="text-sm font-medium text-gray-900 dark:text-gray-500 "
                      >
                        Boleta
                      </label>
                      <input
                        type="radio"
                        id="boleta"
                        name="recibo_cotizacion"
                        value="boleta"
                        checked={tipoComprobante === 'boleta'}
                        onChange={handleTipoComprobanteChange}
                        className="w-3 mx-2 text-blue-600 bg-gray-100 focus:ring-0"
                      />
                    </div>
                    {/* Segundo botón de opción */}
                    <div>
                      <label
                        htmlFor="factura"
                        className="text-sm font-medium text-gray-900 dark:text-gray-500 "
                      >
                        Factura
                      </label>
                      <input
                        type="radio"
                        id="factura"
                        name="recibo_cotizacion"
                        value="factura"
                        checked={tipoComprobante === 'factura'}
                        onChange={handleTipoComprobanteChange}
                        className="w-3 mx-2 text-blue-600 bg-gray-100 focus:ring-0"
                      />
                    </div>
                    <div></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgregarEnvio;
