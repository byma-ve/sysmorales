export const DatosRemitente = ({ datosRegistro, formValues }) => {
  return (
    <>
      <div className="DatosRemitente mb-2 ">
        <div className="side-titulo ">
          <h1 className="uppercase font-semibold text-white py-2 px-4 mb-2 bg-blue-400 rounded-t-xl  ">
            Datos de Remitente
          </h1>
        </div>
        <div className="section-crm ">
          <div className="card-container">
            <form className="mb-2">
              <div className="grid grid-cols-[1fr,2fr,1fr,2fr] px-4  gap-2 mb-2">
                <div>
                  <label
                    htmlFor="fecha-registro"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    F. Registro:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="fecha-registro"
                    value={formValues.fecha_creado}
                    className="w-[90%] pl-1 text-gray-900 font-semibold text-xs  border rounded   h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-[1fr,2fr,1fr,2fr] px-4  gap-2   ">
                <div className=" ">
                  <label
                    htmlFor="cliente"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Cliente:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="cliente"
                    value={
                      datosRegistro.razon_social_cliente
                        ? datosRegistro.razon_social_cliente
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold text-xs  border rounded   h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="o-servicio"
                    className="text-gray-600 font-semibold text-sm whitespace-nowrap"
                  >
                    Guía Madre:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="o-servicio"
                    value={formValues.id_orden_servicio_registro_carga}
                    className="w-[90%] pl-1 text-gray-900 font-semibold text-xs border rounded  -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="rucDni"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    RUC/DNI:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="rucDni"
                    value={
                      datosRegistro.dni_cliente ? datosRegistro.dni_cliente : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold  border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="direccion"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Direccion:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="direccion"
                    value={
                      datosRegistro.direccion_cliente
                        ? datosRegistro.direccion_cliente
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold  border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="contacto"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Contacto:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="contacto"
                    value={
                      datosRegistro.contacto_cliente
                        ? datosRegistro.contacto_cliente
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold  border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="departamento"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Departament:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="departamento"
                    value={
                      datosRegistro.DEPARTAMENTO
                        ? datosRegistro.DEPARTAMENTO
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold  border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="telefono"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Telefono:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="telefono"
                    value={
                      datosRegistro.telefono_cliente
                        ? datosRegistro.telefono_cliente
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold  border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="provincia"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Provincia:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="provincia"
                    value={
                      datosRegistro.PROVINCIA ? datosRegistro.PROVINCIA : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="correo"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Correo:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="correo"
                    value={
                      datosRegistro.email_cliente
                        ? datosRegistro.email_cliente
                        : ""
                    }
                    className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500    focus:shadow-md"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="distrito"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Distrito:
                  </label>
                </div>
                <div className="ml-[-10px]">
                  <input
                    readOnly
                    type="text"
                    id="distrito"
                    value={datosRegistro.DESTINO ? datosRegistro.DESTINO : ""}
                    className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
