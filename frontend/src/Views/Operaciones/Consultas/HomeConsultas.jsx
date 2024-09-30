import React, { useState, useEffect } from "react";
import Home from "../../../Layout/Home";
import SearchConsultas from "./Components/SearchConsultas";
import Tabla from "./Components/tabla";
function HomeConsultas() {
  const [registros, setRegistros] = useState([]);

  const cargarRegistros = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Consultas/obtenerConsultas.php"
      );
      const data = await response.json();
      const transformedRegistros= data.map((guia) => ({
        value: guia.id_num_guia_registro_carga,
        label: guia.id_num_guia_registro_carga,
      }));
      setRegistros(transformedRegistros);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const [datosConsulta, setDatosConsulta] = useState([]);

  const cargarDatosConsulta = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Consultas/obtenerConsulta.php?id_num_guia=${value}`
      );
      const data = await response.json();
      setDatosConsulta(data);
    } catch (error) {
      console.error("Error cargar datos consulta:", error);
    }
  };

  const [informacionInstancia, setInformacionInstancia] = useState([]);

  const cargarDatosInstancia = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Consultas/obtenerInstancia.php?id_num_guia=${value}`
      );
      const data = await response.json();
      setInformacionInstancia(data);
    } catch (error) {
      console.error("Error cargar datos consulta:", error);
    }
  };

  const handleSelectGuia = (event) => {
    cargarDatosConsulta(event.target.value);
    cargarDatosInstancia(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Home
      children1={
        <>
          <SearchConsultas
            handleSelectGuia={handleSelectGuia}
            registros={registros}
            titlle={"Consultas"}
          />
        </>
      }
      children2={
        <>
          <div className=" Contenedores   rounded-xl  bg-white ">
            <div className="1 grid grid-cols-2  ">
              <div className="DatosRemitente mb-2 ">
                <div className="side-titulo ">
                  <h1 className="uppercase font-semibold text-white py-1 px-3 mb-1  bg-blue-400 rounded-tl-xl  ">
                    Datos de Remitente
                  </h1>
                </div>
                <div className="section-crm ">
                  <div className="card-container">
                    <form className="mb-1">
                      <div className="grid grid-cols-4 px-5 ">
                        <div className=" ">
                          <label
                            htmlFor="cotizacion"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Cliente:
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="cotizacion"
                            value={
                              datosConsulta.razon_social_cliente
                                ? datosConsulta.razon_social_cliente
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold  text-sm  border rounded   h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="direccion"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Guía Madre
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="direccion"
                            value={
                              datosConsulta.id_orden_servicio
                                ? datosConsulta.id_orden_servicio
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="rucDni"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            RUC/DNI
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="rucDni"
                            value={
                              datosConsulta.dni_cliente
                                ? datosConsulta.dni_cliente
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="contacto"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Direccion
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.direccion_cliente
                                ? datosConsulta.direccion_cliente
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="contacto"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Contacto-Recojo
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.contacto_cliente
                                ? datosConsulta.contacto_cliente
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="departamento"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Departamento
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.DEPARTAMENTO
                                ? datosConsulta.DEPARTAMENTO
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="departamento"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Telefono
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.telefono_cliente
                                ? datosConsulta.telefono_cliente
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="departamento"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Provincia
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.PROVINCIA
                                ? datosConsulta.PROVINCIA
                                : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="departamento"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Correo(Email)
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            value={
                              datosConsulta.email_cliente
                                ? datosConsulta.email_cliente
                                : ""
                            }
                            id="contacto"
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                        <div className="">
                          <label
                            htmlFor="departamento"
                            className="text-gray-600 font-semibold text-sm"
                          >
                            Distrito
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            id="contacto"
                            value={
                              datosConsulta.DESTINO ? datosConsulta.DESTINO : ""
                            }
                            className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                            readOnly
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="DatosDestinarios  ">
                <div className="side-titulo ">
                  <h1 className="uppercase font-semibold text-white py-1 mb-1 bg-blue-400 rounded-tr-xl ">
                    Datos Destinarios
                  </h1>
                </div>
                <div className="section-crm rounded-br-xl">
                  <div className="card-container">
                    <form className="grid grid-cols-4     pb-3">
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Consignado
                        </label>
                      </div>
                      <div>
                        <input
                          value={
                            datosConsulta.consignado
                              ? datosConsulta.consignado
                              : ""
                          }
                          type="text"
                          id="cotizacion"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Tipo Envio
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="cotizacion"
                          value={
                            datosConsulta.tarifario
                              ? datosConsulta.tarifario.toUpperCase()
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="rucDni"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          RUC/DNI
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="rucDni"
                          value={
                            datosConsulta.dni_ruc ? datosConsulta.dni_ruc : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="direccion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Departamento
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={
                            datosConsulta.departamento_destino
                              ? datosConsulta.departamento_destino
                              : ""
                          }
                          id="direccion"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contacto"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Numero
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.telefono ? datosConsulta.telefono : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Provincia
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.provincia_destino
                              ? datosConsulta.provincia_destino
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Telefono-Extra
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.telefono_exc
                              ? datosConsulta.telefono_exc
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Distrito
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={
                            datosConsulta.distrito_destino
                              ? datosConsulta.distrito_destino
                              : ""
                          }
                          id="contacto"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Direccion
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.direccion
                              ? datosConsulta.direccion
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          T.Min Entrega
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={
                            datosConsulta.tmin_entrega
                              ? datosConsulta.tmin_entrega
                              : ""
                          }
                          id="contacto"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Referencias
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.referencias
                              ? datosConsulta.referencias
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          T.Max Entrega
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.tmax_entrega
                              ? datosConsulta.tmax_entrega
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="2 grid grid-cols-2">
              <div className="DatosMercancia mb-2">
                <div className="side-titulo ">
                  <h1 className="uppercase font-semibold text-white py-1 px-3 mb-1 bg-blue-400  ">
                    Datos Mercancia
                  </h1>
                </div>
                <div className="section-crm ">
                  <div className="card-container">
                    <form className="grid grid-cols-4  px-5   pb-2">
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Tipo-Movimiento
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="cotizacion"
                          value={
                            datosConsulta.tipo_envio
                              ? datosConsulta.tipo_envio.toUpperCase()
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Tipo Logistica
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="cotizacion"
                          value={
                            datosConsulta.tipo_logistica
                              ? datosConsulta.tipo_logistica.toUpperCase()
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="rucDni"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Conten Merc.
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="rucDni"
                          value={
                            datosConsulta.contenido_mercancia
                              ? datosConsulta.contenido_mercancia
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="direccion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Cantidad Merc.
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="direccion"
                          value={
                            datosConsulta.cantidad_mercancia
                              ? datosConsulta.cantidad_mercancia
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="contacto"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Peso Merc.
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.peso_mercancia
                              ? datosConsulta.peso_mercancia
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Peso Vol.
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.total_peso_volumen
                              ? datosConsulta.total_peso_volumen
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Metros Cubicos
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.total_metros_cubicos
                              ? datosConsulta.total_metros_cubicos
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0 opac focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="departamento"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Valor Mercanc.
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="contacto"
                          value={
                            datosConsulta.valor_mercancia
                              ? datosConsulta.valor_mercancia
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="Documento">
                <div className="side-titulo ">
                  <h1 className="uppercase font-semibold text-white py-1  mb-1 bg-blue-400 ">
                    Documentos
                  </h1>
                </div>
                <div className="section-crm ">
                  <div className="card-container">
                    <form className="grid grid-cols-4     mb-1">
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          G-Transportista
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="cotizacion"
                          value={
                            datosConsulta.guia_transportista
                              ? datosConsulta.guia_transportista
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className=" ">
                        <label
                          htmlFor="cotizacion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          G-Remision
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={
                            datosConsulta.guia_remision
                              ? datosConsulta.guia_remision
                              : ""
                          }
                          id="cotizacion"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="rucDni"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Nro. Pedido:
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="rucDni"
                          value={
                            datosConsulta.documento_1
                              ? datosConsulta.documento_1
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="direccion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Doc.Adicional
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          id="direccion"
                          value={
                            datosConsulta.documento_2
                              ? datosConsulta.documento_2
                              : ""
                          }
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="direccion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          N° Manifiesto
                        </label>
                      </div>
                      <div>
                        <input
                          value={
                            informacionInstancia.Despacho &&
                            informacionInstancia.Despacho.manifiesto
                              ? informacionInstancia.Despacho.manifiesto
                              : ""
                          }
                          type="text"
                          id="direccion"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="direccion"
                          className="text-gray-600 font-semibold text-sm"
                        >
                          Agente
                        </label>
                      </div>
                      <div>
                        <input
                          value={
                            informacionInstancia.Despacho &&
                            informacionInstancia.Despacho.agente
                              ? informacionInstancia.Despacho.agente
                              : ""
                          }
                          type="text"
                          id="direccion"
                          className="ps-1 w-[90%] text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                          readOnly
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Tabla informacionInstancia={informacionInstancia} />
            {/* <Table informacionInstancia={informacionInstancia} /> */}
          </div>
        </>
      }
    />
  );
}

export default HomeConsultas;
