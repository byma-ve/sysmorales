export const DatosDestinatarios = ({ datosRegistro, formValues }) => {
  return (
    <>
      <div className="DatosDestinarios  ">
        <div className="side-titulo ">
          <h1 className="uppercase font-semibold text-white py-2 px-3 mb-2 bg-blue-400  ">
            Datos Destinarios
          </h1>
        </div>
        <div className="section-crm rounded-br-xl pb-4">
          <div className="card-container">
            <form className="grid grid-cols-[1fr,2fr,1fr,2fr]  px-4  gap-2 ">
              <div className=" ">
                <label
                  htmlFor="Consignado"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Consignado:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="Consignado"
                  value={datosRegistro.consignado ? datosRegistro.consignado : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className=" ">
                <label
                  htmlFor="Tipo-Tarifario"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Tipo Envio:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="Tipo-Tarifario"
                  value={datosRegistro.tarifario ? datosRegistro.tarifario.toUpperCase() : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="rucDni-destinatarios"
                  className="text-gray-600 font-semibold text-sm"
                >
                  RUC/DNI:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="rucDni-destinatarios"
                  value={datosRegistro.dni_ruc ? datosRegistro.dni_ruc : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Departamento-destinatarios"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Departamento:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  value={datosRegistro.departamento_destino ? datosRegistro.departamento_destino : ''}
                  id="Departamento-destinatarios"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="numero"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Numero:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="numero"
                  value={datosRegistro.telefono ? datosRegistro.telefono : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="provincia-destinatarios"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Provincia:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  value={datosRegistro.provincia_destino ? datosRegistro.provincia_destino : ''}
                  id="provincia-destinatarios"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="telefono-extra"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Tel-Extra:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="telefono-extra"
                  value={datosRegistro.telefono_exc ? datosRegistro.telefono_exc : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="distrito-destinatario"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Distrito:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="distrito-destinatario"
                  value={datosRegistro.distrito_destino ? datosRegistro.distrito_destino : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="direccion-destinatario"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Direccion:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  id="direccion-destinatario"
                  value={datosRegistro.direccion ? datosRegistro.direccion : ''}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500   focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="referencias"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Referencias:
                </label>
              </div>
              <div className="ml-[-10px]">
                <input
                  readOnly
                  type="text"
                  value={datosRegistro.referencias ? datosRegistro.referencias : ''}
                  id="referencias"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
