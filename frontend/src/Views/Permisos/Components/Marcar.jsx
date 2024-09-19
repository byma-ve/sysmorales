import React, { useEffect } from "react";
import { IconoAbajo, IconoArriba } from "../../../Iconos/Iconos-NavBar";

function Marcar({
  mostrarIconoComercial,
  setMostrarIconoComercial,
  mostrarIconoOperaciones,
  setMostrarIconoOperaciones,
  mostrarIconoComprobantes,
  setMostrarIconoComprobantes,
  mostrarIconoAdministracion,
  setMostrarIconoAdministracion,
  comercial,
  setComercial,
  cotizacion,
  setCotizacion,

  puntoDeVenta,
  setPuntoDeVenta,
  validacion,
  setValidacion,
  operaciones,
  setOperaciones,
  AjustedeGuias,
  setAjustedeGuias,
  renvio,
  setRenvio,
  Rmasivo,
  setRmasivo,
  Programacion,
  setProgramacion,
  Asignacion,
  setAsignacion,
  Listacarga,
  setListacarga,
  RegistroCarga,
  setRegistroCarga,
  Estados,
  setEstados,
  Despacho,
  setDespacho,
  Consultas,
  setConsultas,
  Seguimiento,
  setSeguimiento,
  Comprobantes,
  setComprobantes,
  Panel,
  setPanel,
  FacturaBoleta,
  setFacturaBoleta,
  GuiaRemision,
  setGuiaRemision,
  DebitoCredito,
  setDebitoCredito,
  Documentodebaja,
  setDocumentodebaja,
  Reportes,
  setReportes,
  liquidacion,
  setLiquidacion,
  administracion,
  setAdministracion,
  Cusuario,
  setCusuario,
  Ccliente,
  setCcliente,
  Cproveedor,
  setCproveedor,
  Cvehiculo,
  setCvehiculo,
  Carea,
  setCarea,
  tarifarios,
  setTarifarios,
  ajustes,
  setAjustes,
}) {
  useEffect(() => {
    if (!cotizacion && !puntoDeVenta && !validacion) {
      setComercial(false);
    }
  }, [cotizacion, puntoDeVenta, validacion]);

  const handleComercialChange = (e) => {
    const checked = e.target.checked;
    setComercial(checked);
    setCotizacion(checked);
    setPuntoDeVenta(checked);
    setValidacion(checked);
  };

  const handleCheckboxChange1 = (setter) => (e) => {
    if (comercial) {
      setter(e.target.checked);
    } else {
      setter(false);
    }
  };

  useEffect(() => {
    if (
      !renvio &&
      !AjustedeGuias &&
      !Rmasivo &&
      !Programacion &&
      !Asignacion &&
      !Listacarga &&
      !RegistroCarga &&
      !Estados &&
      !Despacho &&
      !Consultas &&
      !Seguimiento
    ) {
      setOperaciones(false);
    }
  }, [
    renvio,
    AjustedeGuias,
    Rmasivo,
    Programacion,
    Asignacion,
    Listacarga,
    RegistroCarga,
    Estados,
    Despacho,
    Consultas,
    Seguimiento,
  ]);

  useEffect(() => {
    if (
      !Panel &&
      !FacturaBoleta &&
      !GuiaRemision &&
      !DebitoCredito &&
      !Documentodebaja &&
      !Reportes
    ) {
      setComprobantes(false);
    }
  }, [
    Panel,
    FacturaBoleta,
    GuiaRemision,
    DebitoCredito,
    Documentodebaja,
    Reportes,
  ]);

  const handleOperacionesChange = (e) => {
    const checked = e.target.checked;
    setOperaciones(checked);
    setAjustedeGuias(checked);
    setRenvio(checked);
    setRmasivo(checked);
    setProgramacion(checked);
    setAsignacion(checked);
    setListacarga(checked);
    setRegistroCarga(checked);
    setEstados(checked);
    setDespacho(checked);
    setConsultas(checked);
    setSeguimiento(checked);
  };
  const handleComprobantesChange = (e) => {
    const checked = e.target.checked;
    setComprobantes(checked);
    setPanel(checked);
    setFacturaBoleta(checked);
    setGuiaRemision(checked);
    setDebitoCredito(checked);
    setDocumentodebaja(checked);
    setReportes(checked);
  };

  const handleCheckboxChange4 = (setter) => (e) => {
    if (Comprobantes) {
      setter(e.target.checked);
    }
  };

  const handleCheckboxChange2 = (setter) => (e) => {
    if (operaciones) {
      setter(e.target.checked);
    }
  };

  useEffect(() => {
    if (!Cusuario && !Ccliente && !Cproveedor && !Cvehiculo && !Carea) {
      setAdministracion(false);
    }
  }, [Cusuario, Ccliente, Cproveedor, Cvehiculo, Carea]);

  const handleAdministracionChange = (e) => {
    const checked = e.target.checked;
    setAdministracion(checked);
    setCusuario(checked);
    setCcliente(checked);
    setCproveedor(checked);
    setCvehiculo(checked);
    setCarea(checked);
  };

  const handleCheckboxChange3 = (setter) => (e) => {
    if (administracion) {
      setter(e.target.checked);
    }
  };

  const handleLiquidacionChange = (e) => {
    const checked = e.target.checked;
    setLiquidacion(checked);
  };

  const handleTarifariosChange = (e) => {
    const checked = e.target.checked;
    setTarifarios(checked);
  };

  const handleAjustesChange = (e) => {
    const checked = e.target.checked;
    setAjustes(checked);
  };

  return (
    <>
      <div className="Comercial px-10 mb-5 relative">
        <div className="marcaje1 mb-5 ">
          <div className="flex items-center">
            <label className="relative inline-flex items-center w-full   border border-blue-400 rounded p-3 min-w-full">
              <input
                type="checkbox"
                checked={comercial}
                onChange={handleComercialChange}
                className="sr-only peer "
              />
              <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
              <span className="ms-4 text-base font-normal text-gray-600 ">
                Comercial
              </span>
            </label>
            <div
              className="absolute z-50 right-[330px]  p-1 rounded-lg bg-[rgb(1,1,1,0.05)] hover:bg-[rgb(1,1,1,0.1)]  cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Detener la propagación del evento
                setMostrarIconoComercial(!mostrarIconoComercial);
              }}
            >
              {mostrarIconoComercial ? (
                <IconoArriba />
              ) : (
                <IconoAbajo className="  z-50" />
              )}
            </div>
          </div>
          {mostrarIconoComercial && (
            <div className="flex flex-col">
              <>
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={cotizacion}
                    onChange={handleCheckboxChange1(setCotizacion)}
                    disabled={!comercial}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Cotización
                  </span>
                </label>

                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={puntoDeVenta}
                    onChange={handleCheckboxChange1(setPuntoDeVenta)}
                    disabled={!comercial}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Punto de Venta
                  </span>
                </label>
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={validacion}
                    onChange={handleCheckboxChange1(setValidacion)}
                    disabled={!comercial}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Validación
                  </span>
                </label>
              </>
            </div>
          )}
        </div>
      </div>
      <div className="Operaciones px-10 mb-5 relative">
        <div className="marcaje1 mb-3">
          <div className="flex items-center">
            <label className="relative inline-flex items-center w-full   border border-blue-400 rounded p-3 min-w-full">
              <input
                type="checkbox"
                checked={operaciones}
                onChange={handleOperacionesChange}
                className="sr-only peer"
              />
              <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
              <span className="ms-3 text-base font-normal text-gray-600">
                Operaciones
              </span>
            </label>

            <div
              className="absolute z-50 right-[318px]  p-1 rounded-lg bg-[rgb(1,1,1,0.05)] hover:bg-[rgb(1,1,1,0.1)]  cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Detener la propagación del evento
                setMostrarIconoOperaciones(!mostrarIconoOperaciones);
              }}
            >
              {mostrarIconoOperaciones ? (
                <IconoArriba />
              ) : (
                <IconoAbajo className="" />
              )}
            </div>
          </div>
          {mostrarIconoOperaciones && (
            <div className="Comercial flex flex-col">
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={AjustedeGuias}
                  onChange={handleCheckboxChange2(setAjustedeGuias)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Ajuste de Guias
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={renvio}
                  onChange={handleCheckboxChange2(setRenvio)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Registro de Envio
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Rmasivo}
                  onChange={handleCheckboxChange2(setRmasivo)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Registro Masivo
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Programacion}
                  onChange={handleCheckboxChange2(setProgramacion)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />

                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Programación
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Asignacion}
                  onChange={handleCheckboxChange2(setAsignacion)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Asignación Recojo
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Listacarga}
                  disabled={!operaciones}
                  onChange={handleCheckboxChange2(setListacarga)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Lista Recojos
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={RegistroCarga}
                  disabled={!operaciones}
                  onChange={handleCheckboxChange2(setRegistroCarga)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Registro Carga
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Estados}
                  onChange={handleCheckboxChange2(setEstados)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />

                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Estados
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Despacho}
                  onChange={handleCheckboxChange2(setDespacho)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />

                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Despacho
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Consultas}
                  onChange={handleCheckboxChange2(setConsultas)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Consultas
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Seguimiento}
                  onChange={handleCheckboxChange2(setSeguimiento)}
                  disabled={!operaciones}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Seguimiento
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="Comprobantes px-10 mb-5 relative">
        <div className="marcaje1 mb-3">
          <div className="flex items-center">
            <label className="relative inline-flex items-center w-full   border border-blue-400 rounded p-3 min-w-full">
              <input
                type="checkbox"
                checked={Comprobantes}
                onChange={handleComprobantesChange}
                className="sr-only peer"
              />
              <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
              <span className="ms-3 text-base font-normal text-gray-600">
                Comprobantes
              </span>
            </label>

            <div
              className="absolute z-50 right-[305px]  p-1 rounded-lg bg-[rgb(1,1,1,0.05)] hover:bg-[rgb(1,1,1,0.1)]  cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Detener la propagación del evento
                setMostrarIconoComprobantes(!mostrarIconoComprobantes);
              }}
            >
              {mostrarIconoComprobantes ? (
                <IconoArriba />
              ) : (
                <IconoAbajo className="" />
              )}
            </div>
          </div>
          {mostrarIconoComprobantes && (
            <div className="Comercial flex flex-col">
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Panel}
                  onChange={handleCheckboxChange4(setPanel)}
                  disabled={!Comprobantes}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Panel
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={FacturaBoleta}
                  onChange={handleCheckboxChange4(setFacturaBoleta)}
                  disabled={!Comprobantes}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Crear Factura/Boleta
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={GuiaRemision}
                  onChange={handleCheckboxChange4(setGuiaRemision)}
                  disabled={!Comprobantes}
                  className="sr-only peer"
                />

                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Crear Guia Remision
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={DebitoCredito}
                  onChange={handleCheckboxChange4(setDebitoCredito)}
                  disabled={!Comprobantes}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Crear N.Debito/Credito
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Documentodebaja}
                  disabled={!Comprobantes}
                  onChange={handleCheckboxChange4(setDocumentodebaja)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Documento de baja
                </span>
              </label>
              <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                <input
                  type="checkbox"
                  checked={Reportes}
                  disabled={!Comprobantes}
                  onChange={handleCheckboxChange4(setReportes)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                <span className="ms-3 text-sm font-normal text-gray-600">
                  Reportes
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="Liquidacion px-10 mb-5">
        <div className="marcaje1 mb-5">
          <label className="relative inline-flex items-center    border border-blue-400  rounded p-3 min-w-full">
            <input
              type="checkbox"
              checked={liquidacion}
              onChange={handleLiquidacionChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
            <span className="ms-3 text-base font-normal text-gray-600">
              Liquidación
            </span>
          </label>
        </div>

        {/* Agregar otros marcaje1 según sea necesario */}
      </div>

      <div className="Administracion px-10 mb-5 relative ">
        <div className="marcaje1 mb-3">
          <div className="flex flex-col    ">
            <label className="relative inline-flex items-center w-full   border border-blue-400 rounded p-3 min-w-full">
              <input
                type="checkbox"
                checked={administracion}
                onChange={handleAdministracionChange}
                className="sr-only peer"
              />
              <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>

              <span className="ms-3 text-base font-normal text-gray-600">
                Administración
              </span>
            </label>
            <div
              className="absolute z-50 right-[300px] mt-3  p-1 rounded-lg bg-[rgb(1,1,1,0.05)] hover:bg-[rgb(1,1,1,0.1)]  cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Detener la propagación del evento
                setMostrarIconoAdministracion(!mostrarIconoAdministracion);
              }}
            >
              {mostrarIconoAdministracion ? (
                <IconoArriba />
              ) : (
                <IconoAbajo className />
              )}
            </div>
            {mostrarIconoAdministracion && (
              <div className=" flex flex-col">
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={Cusuario}
                    onChange={handleCheckboxChange3(setCusuario)}
                    disabled={!administracion}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Crear Usuario
                  </span>
                </label>

                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={Ccliente}
                    onChange={handleCheckboxChange3(setCcliente)}
                    disabled={!administracion}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Crear Cliente
                  </span>
                </label>
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={Cproveedor}
                    onChange={handleCheckboxChange3(setCproveedor)}
                    disabled={!administracion}
                    className="sr-only peer"
                  />

                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Crear Proveedor
                  </span>
                </label>
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={Cvehiculo}
                    onChange={handleCheckboxChange3(setCvehiculo)}
                    disabled={!administracion}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Crear Vehiculo
                  </span>
                </label>
                <label className="relative inline-flex items-center border border-white-400  p-2 w-11/12 ml-6">
                  <input
                    type="checkbox"
                    checked={Carea}
                    onChange={handleCheckboxChange3(setCarea)}
                    disabled={!administracion}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-10 after:absolute after:top-[.5rem]  after:bg-white after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-blue-400"></div>
                  <span className="ms-3 text-sm font-normal text-gray-600">
                    Crear Area
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="Tarifarios px-10 mb-5   ">
        <div className="marcaje1 mb-5 ">
          <label className="relative inline-flex items-center    border border-blue-400  rounded p-3 min-w-full">
            <input
              type="checkbox"
              checked={tarifarios}
              onChange={handleTarifariosChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
            <span className="ms-3 text-base font-normal text-gray-600">
              Tarifarios
            </span>
          </label>
        </div>
      </div>

      <div className="Ajustes px-10">
        <div className="marcaje1">
          <label className="relative inline-flex items-center  border border-blue-400  rounded p-3 min-w-full">
            <input
              type="checkbox"
              checked={ajustes}
              onChange={handleAjustesChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-gray-300 cursor-pointer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[.875rem] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all border-gray-600 peer-checked:bg-blue-400"></div>
            <span className="ms-3 text-base font-normal text-gray-600">
              Ajustes
            </span>
          </label>
        </div>
      </div>
    </>
  );
}

export default Marcar;
