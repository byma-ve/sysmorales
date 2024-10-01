import { useEffect, useState } from "react";
import { IconoAjuste } from "../../../Iconos/Iconos-NavBar";
import Marcar from "../Components/Marcar";
import Swal from "sweetalert2";

export const Configuracion = ({
  modalVisible,
  setModalVisible,
  dni_usuario,
}) => {
  const ocultarModal = () => {
    setModalVisible(false);
  };

  const [permisos, setPermisos] = useState("");

  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Permisos/obtenerPermisos.php?dni_usuario=${dni_usuario}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPermisos(data);
        setCotizacion(data.comercial_cotizacion_permiso !== 0);
        setPuntoDeVenta(data.comercial_punto_venta_permiso !== 0);
        setValidacion(data.comercial_validacion_permiso !== 0);
        setAjustedeGuias(data.operaciones_ajustar_guias_permiso !== 0);
        setRenvio(data.operaciones_registro_envio_permiso !== 0);
        setRmasivo(data.operaciones_registro_masivo_permiso !== 0);
        setProgramacion(data.operaciones_programacion_permiso !== 0);
        setAsignacion(data.operaciones_asignacion_recojo_permiso !== 0);
        setListacarga(data.operaciones_lista_recojo_permiso !== 0);
        setRegistroCarga(data.operaciones_registro_carga_permiso !== 0);
        setEstados(data.operaciones_estado_permiso !== 0);
        setDespacho(data.operaciones_despacho_permiso !== 0);
        setConsultas(data.operaciones_consultas_permiso !== 0);
        setSeguimiento(data.operaciones_seguimiento_permiso !== 0);
        setPanel(data.comprobantes_panel_permiso !== 0);
        setFacturaBoleta(data.comprobantes_crear_factura_boleta_permiso !== 0);
        setGuiaRemision(data.comprobantes_crear_guia_remision_permiso !== 0);
        setDebitoCredito(data.comprobantes_crear_n_debito_permiso !== 0);
        setDocumentodebaja(data.comprobantes_documento_baja_permiso !== 0);
        setReportes(data.comprobantes_reportes_permiso !== 0);
        setLiquidacion(data.liquidacion_permiso !== 0);
        setCusuario(data.administracion_usuario_permiso !== 0);
        setCcliente(data.administracion_cliente_permiso !== 0);
        setCproveedor(data.administracion_proveedor_permiso !== 0);
        setCvehiculo(data.administracion_vehiculo_permiso !== 0);
        setCarea(data.administracion_area_permiso !== 0);
        setTarifarios(data.tarifarios_permiso !== 0);
        setAjustes(data.ajustes_permiso !== 0);
      })
      .catch((error) => console.error("Error:", error));
  }, [dni_usuario]);

  // Funcion para Ocultas y Mostrar los checkbox de cada Capsula
  const [mostrarIconoComercial, setMostrarIconoComercial] = useState(true);
  const [mostrarIconoOperaciones, setMostrarIconoOperaciones] = useState(true);
  const [mostrarIconoComprobantes, setMostrarIconoComprobantes] =
    useState(true);
  const [mostrarIconoAdministracion, setMostrarIconoAdministracion] =
    useState(true);
  // Capsula Operaciones
  const [comercial, setComercial] = useState(true);
  const [cotizacion, setCotizacion] = useState(true);
  const [puntoDeVenta, setPuntoDeVenta] = useState(true);
  const [validacion, setValidacion] = useState(true);
  // Capsula Operaciones
  const [operaciones, setOperaciones] = useState(true);
  const [AjustedeGuias, setAjustedeGuias] = useState(true);

  const [renvio, setRenvio] = useState(true);
  const [Rmasivo, setRmasivo] = useState(true);
  const [Programacion, setProgramacion] = useState(true);
  const [Asignacion, setAsignacion] = useState(true);
  const [Listacarga, setListacarga] = useState(true);
  const [RegistroCarga, setRegistroCarga] = useState(true);
  const [Estados, setEstados] = useState(true);
  const [Despacho, setDespacho] = useState(true);
  const [Consultas, setConsultas] = useState(true);
  const [Seguimiento, setSeguimiento] = useState(true);
  // Capsula Comprobantes
  const [Comprobantes, setComprobantes] = useState(true);
  const [Panel, setPanel] = useState(true);
  const [FacturaBoleta, setFacturaBoleta] = useState(true);
  const [GuiaRemision, setGuiaRemision] = useState(true);
  const [DebitoCredito, setDebitoCredito] = useState(true);
  const [Documentodebaja, setDocumentodebaja] = useState(true);
  const [Reportes, setReportes] = useState(true);

  // Capsula Liquidacion
  const [liquidacion, setLiquidacion] = useState(true);
  // Capsula Administracion
  const [administracion, setAdministracion] = useState(true);
  const [Cusuario, setCusuario] = useState(true);
  const [Ccliente, setCcliente] = useState(true);
  const [Cproveedor, setCproveedor] = useState(true);
  const [Cvehiculo, setCvehiculo] = useState(true);
  const [Carea, setCarea] = useState(true);
  // Capsula Tarifarios
  const [tarifarios, setTarifarios] = useState(true);
  // Capsula Ajustes
  const [ajustes, setAjustes] = useState(true);

  const handleSubmit = async () => {
    try {
      const data = {
        dni_usuario,
        //Comercial
        cotizacion,
        puntoDeVenta,
        validacion,
        //Operaciones
        AjustedeGuias,
        renvio,
        Rmasivo,
        Programacion,
        Asignacion,
        Listacarga,
        RegistroCarga,
        Estados,
        Despacho,
        Consultas,
        Seguimiento,
        // Comprbantes
        Panel,
        FacturaBoleta,
        GuiaRemision,
        DebitoCredito,
        Documentodebaja,
        Reportes,
        //Liquidacion
        liquidacion,
        //Administracion
        Cusuario,
        Ccliente,
        Cproveedor,
        Cvehiculo,
        Carea,
        //Tarifarios
        tarifarios,
        //Ajustes
        ajustes,
      };
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Permisos/editarPermisos.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        ocultarModal();
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalVisible ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full z-[9999999999999999999999999999999999999999999]`}
      >
        <div className="fondo-absoluto w-full h-full bg-[rgba(0,0,0,0.4)] opacity-5"></div>
        <div
          className={`side-panel-cont-container ${
            modalVisible ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[600px] h-full block absolute top-0 right-0 bottom-0 bg-white transition-transform duration-1000`}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 mb-6">
            <div className="side-panel-iframe relative w-full h-full overflow-y-auto ScrollTableVertical ">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-4 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Herramientas</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container ">
                      <form>
                        <div className="bg-slate-100  rounded-50 mr-15  rounded-[10px] mt-3  ">
                          <div className="cont-titulo  flex mb-3 px-6">
                            <div className="icono p-1 mt-4 ">
                              <IconoAjuste />
                            </div>
                            <div className="cont-txt  mt-3 px-2 text-slate-800 text-xl font-light  ">
                              <h1>Herramientas del Menú Principal</h1>
                            </div>
                          </div>
                          <div>
                            <div>
                              <div className="bg-slate-100">
                                <div className="mb-4">
                                  <hr className=" border-gray-200  " />
                                </div>
                                <Marcar
                                  mostrarIconoComercial={mostrarIconoComercial}
                                  setMostrarIconoComercial={
                                    setMostrarIconoComercial
                                  }
                                  mostrarIconoOperaciones={
                                    mostrarIconoOperaciones
                                  }
                                  setMostrarIconoOperaciones={
                                    setMostrarIconoOperaciones
                                  }
                                  mostrarIconoComprobantes={
                                    mostrarIconoComprobantes
                                  }
                                  setMostrarIconoComprobantes={
                                    setMostrarIconoComprobantes
                                  }
                                  mostrarIconoAdministracion={
                                    mostrarIconoAdministracion
                                  }
                                  setMostrarIconoAdministracion={
                                    setMostrarIconoAdministracion
                                  }
                                  comercial={comercial}
                                  setComercial={setComercial}
                                  cotizacion={cotizacion}
                                  setCotizacion={setCotizacion}
                                  puntoDeVenta={puntoDeVenta}
                                  setPuntoDeVenta={setPuntoDeVenta}
                                  validacion={validacion}
                                  setValidacion={setValidacion}
                                  operaciones={operaciones}
                                  setOperaciones={setOperaciones}
                                  AjustedeGuias={AjustedeGuias}
                                  setAjustedeGuias={setAjustedeGuias}
                                  renvio={renvio}
                                  setRenvio={setRenvio}
                                  Rmasivo={Rmasivo}
                                  setRmasivo={setRmasivo}
                                  Programacion={Programacion}
                                  setProgramacion={setProgramacion}
                                  Asignacion={Asignacion}
                                  setAsignacion={setAsignacion}
                                  Listacarga={Listacarga}
                                  setListacarga={setListacarga}
                                  RegistroCarga={RegistroCarga}
                                  setRegistroCarga={setRegistroCarga}
                                  Estados={Estados}
                                  setEstados={setEstados}
                                  Despacho={Despacho}
                                  setDespacho={setDespacho}
                                  Consultas={Consultas}
                                  setConsultas={setConsultas}
                                  Seguimiento={Seguimiento}
                                  setSeguimiento={setSeguimiento}
                                  Comprobantes={Comprobantes}
                                  setComprobantes={setComprobantes}
                                  Panel={Panel}
                                  setPanel={setPanel}
                                  FacturaBoleta={FacturaBoleta}
                                  setFacturaBoleta={setFacturaBoleta}
                                  GuiaRemision={GuiaRemision}
                                  setGuiaRemision={setGuiaRemision}
                                  DebitoCredito={DebitoCredito}
                                  setDebitoCredito={setDebitoCredito}
                                  Documentodebaja={Documentodebaja}
                                  setDocumentodebaja={setDocumentodebaja}
                                  Reportes={Reportes}
                                  setReportes={setReportes}
                                  liquidacion={liquidacion}
                                  setLiquidacion={setLiquidacion}
                                  administracion={administracion}
                                  setAdministracion={setAdministracion}
                                  Cusuario={Cusuario}
                                  setCusuario={setCusuario}
                                  Ccliente={Ccliente}
                                  setCcliente={setCcliente}
                                  Cproveedor={Cproveedor}
                                  setCproveedor={setCproveedor}
                                  Cvehiculo={Cvehiculo}
                                  setCvehiculo={setCvehiculo}
                                  Carea={Carea}
                                  setCarea={setCarea}
                                  tarifarios={tarifarios}
                                  setTarifarios={setTarifarios}
                                  ajustes={ajustes}
                                  setAjustes={setAjustes}
                                />
                                <div className="mb-4 h-5"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end rounded-b mt-7">
                          <button
                            onClick={handleSubmit}
                            type="button"
                            className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={ocultarModal}
                            type="button"
                            className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
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
