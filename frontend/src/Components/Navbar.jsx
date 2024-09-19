import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import {
  IconoOperaciones,
  IconoComprobante,
  IconoHamburguesa,
  IconoTarifario,
  IconoDashboard,
  IconoPanel,
  IconoAdministracion,
  IconoCrearCliente,
  IconoEngrane,
  IconoFacturaBoleta,
  IconoReportes,
  IconoRegistroEnvio,
  IconoRegistroMasivo,
  IconoProgramacion,
  IconoAsignacionRecojo,
  IconoListaRecojo,
  IconoRegistroCarga,
  IconoEstados,
  IconoDespacho,
  IconoConsultas,
  IconoSeguimiento,
  IconoCotizacion,
  IconoComercial,
  IconoPuntoVenta,
  IconoValidacion,
  IconoLiquidacion,
  IconoUP,
  IconoDown,
  IconoPermisos,
} from "../Iconos/Iconos-NavBar";

function NavBar({ handleMenuHover, handleMenuLeave }) {
  const [menuIconosVisible, setMenuIconosVisible] = useState(true);
  const [abierto, setAbierto] = useState("");
  const [minimizar, setminimizar] = useState(true);
  const [minimizar2, setminimizar2] = useState(false);
  const [minimizar3, setminimizar3] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Nuevo estado para el hover

  const [permisos, setPermisos] = useState("");

  useEffect(() => {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Permisos/obtenerPermisos.php?dni_usuario=${localStorage.getItem(
        "user"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPermisos(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [localStorage.getItem("user")]);

  return (
    <>
      <div
        className={`ContenedorPapa  z-[10]`}
        onMouseEnter={() => setIsHovered(true)} // Manejar el evento de entrada del mouse
        onMouseLeave={() => setIsHovered(false)} // Manejar el evento de salida del mouse
      >
        <div className={`menu-lateral ${abierto} z-[10]`}>
          <div
            onMouseEnter={handleMenuHover}
            onMouseLeave={handleMenuLeave}
            className={`contenedor ScrollTable2 ${abierto} z-[10]`}
          >
            {menuIconosVisible && (
              <div className={`menu-iconos  ${menuIconosVisible} z-[10]`}>
                <div className="mt-[19px] icon z-[10]">
                  <IconoDashboard className="iconos z-[10]" />
                </div>

                {(permisos.comercial_cotizacion_permiso === 1 ||
                  permisos.comercial_punto_venta_permiso === 1 ||
                  permisos.comercial_validacion_permiso === 1) && (
                  <div className="grupo z-[10]">
                    <IconoComercial className="iconos z-[10]" />
                    {minimizar && (
                      <>
                        {permisos.comercial_cotizacion_permiso === 1 && (
                          <IconoFacturaBoleta className="iconos z-[10]" />
                        )}
                        {permisos.comercial_punto_venta_permiso === 1 && (
                          <IconoPuntoVenta className="iconos z-[10]" />
                        )}
                        {permisos.comercial_validacion_permiso === 1 && (
                          <IconoValidacion className="iconos z-[10]" />
                        )}
                      </>
                    )}
                  </div>
                )}

                {(permisos.operaciones_ajustar_guias_permiso === 1 ||
                  permisos.operaciones_registro_envio_permiso === 1 ||
                  permisos.operaciones_registro_masivo_permiso === 1 ||
                  permisos.operaciones_programacion_permiso === 1 ||
                  permisos.operaciones_asignacion_recojo_permiso === 1 ||
                  permisos.operaciones_lista_recojo_permiso === 1 ||
                  permisos.operaciones_estado_permiso === 1 ||
                  permisos.operaciones_despacho_permiso === 1 ||
                  permisos.operaciones_consultas_permiso === 1 ||
                  permisos.operaciones_seguimiento_permiso === 1) && (
                  <div className="grupo">
                    <IconoOperaciones className="iconos z-[10]" />
                    {minimizar2 && (
                      <>
                        {permisos.operaciones_ajustar_guias_permiso === 1 && (
                          <IconoEngrane className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_registro_envio_permiso === 1 && (
                          <IconoRegistroEnvio className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_registro_masivo_permiso === 1 && (
                          <IconoRegistroMasivo className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_programacion_permiso === 1 && (
                          <IconoProgramacion className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_asignacion_recojo_permiso ===
                          1 && (
                          <IconoAsignacionRecojo className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_lista_recojo_permiso === 1 && (
                          <IconoListaRecojo className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_registro_carga_permiso === 1 && (
                          <IconoRegistroCarga className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_estado_permiso === 1 && (
                          <IconoEstados className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_despacho_permiso === 1 && (
                          <IconoDespacho className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_consultas_permiso === 1 && (
                          <IconoConsultas className="iconos z-[10]" />
                        )}
                        {permisos.operaciones_seguimiento_permiso === 1 && (
                          <IconoSeguimiento className="iconos z-[10]" />
                        )}
                      </>
                    )}
                  </div>
                )}

                {(permisos.comprobantes_panel_permiso === 1 ||
                  permisos.comprobantes_crear_factura_boleta_permiso === 1 ||
                  permisos.comprobantes_crear_guia_remision_permiso === 1 ||
                  permisos.comprobantes_crear_n_debito_permiso === 1 ||
                  permisos.comprobantes_documento_baja_permiso === 1 ||
                  permisos.comprobantes_reportes_permiso === 1) && (
                  <div className="grupo EMISIONDOCS">
                    <IconoComprobante className="iconos z-[10]" />
                    {minimizar3 && (
                      <>
                        {permisos.comprobantes_panel_permiso === 1 && (
                          <IconoPanel className="iconos z-[10]" />
                        )}
                        {permisos.comprobantes_crear_factura_boleta_permiso ===
                          1 && <IconoFacturaBoleta className="iconos z-[10]" />}
                        {permisos.comprobantes_crear_guia_remision_permiso ===
                          1 && <IconoFacturaBoleta className="iconos z-[10]" />}
                        {permisos.comprobantes_crear_n_debito_permiso === 1 && (
                          <IconoFacturaBoleta className="iconos z-[10]" />
                        )}
                        {permisos.comprobantes_documento_baja_permiso === 1 && (
                          <IconoFacturaBoleta className="iconos z-[10]" />
                        )}
                        {permisos.comprobantes_reportes_permiso === 1 && (
                          <IconoReportes className="iconos z-[10]" />
                        )}
                      </>
                    )}
                  </div>
                )}

                {permisos.liquidacion_permiso === 1 && (
                  <div className="grupo z-[10]">
                    <IconoLiquidacion className="iconos z-[10]" />
                  </div>
                )}

                {(permisos.administracion_usuario_permiso === 1 ||
                  permisos.administracion_cliente_permiso === 1 ||
                  permisos.administracion_proveedor_permiso === 1 ||
                  permisos.administracion_vehiculo_permiso === 1 ||
                  permisos.administracion_area_permiso === 1) && (
                  <div className="grupo z-[10]">
                    <IconoAdministracion className="iconos z-[10]" />
                  </div>
                )}

                {permisos.tarifarios_permiso === 1 && (
                  <div className="grupo z-[10]">
                    <IconoTarifario className="iconos z-[10]" />
                  </div>
                )}

                {permisos.ajustes_permiso === 1 && (
                  <div className="grupo z-[10]">
                    <IconoPermisos className="iconos z-[10]" />
                  </div>
                )}

                {/* CONTENEDOR HOVER */}
                <div className="menu-items-hover   z-[10]">
                  <Link
                    to="/dashboard"
                    className="items-hover cont-logo z-[10]"
                  >
                    Dashboard
                  </Link>

                  {minimizar ? (
                    <IconoUP
                      className="Minimizar z-[10]"
                      onClick={() => setminimizar(false)}
                    />
                  ) : (
                    <IconoDown
                      className="Maximizar z-[10]"
                      onClick={() => setminimizar(true)}
                    />
                  )}

                  {(permisos.comercial_cotizacion_permiso === 1 ||
                    permisos.comercial_punto_venta_permiso === 1 ||
                    permisos.comercial_validacion_permiso === 1) && (
                    <div className="grupo2-hover z-[10]">
                      <Link
                        onClick={() => setminimizar(!minimizar)}
                        className="items-hover titulo z-[10]"
                      >
                        Comercial
                      </Link>
                      {minimizar && (
                        <>
                          {permisos.comercial_cotizacion_permiso === 1 && (
                            <Link
                              to="/cotizacion"
                              className="items-hover z-[10]"
                            >
                              Cotizacion
                            </Link>
                          )}
                          {permisos.comercial_punto_venta_permiso === 1 && (
                            <Link
                              to="/puntos-venta"
                              className="items-hover z-[10]"
                            >
                              Puntos de Venta
                            </Link>
                          )}
                          {permisos.comercial_validacion_permiso === 1 && (
                            <Link
                              to="/validacion"
                              className="items-hover z-[10]"
                            >
                              Validación
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {minimizar2 ? (
                    <IconoUP
                      className="Minimizar"
                      onClick={() => setminimizar2(false)}
                    />
                  ) : (
                    <IconoDown
                      className="Maximizar"
                      onClick={() => setminimizar2(true)}
                    />
                  )}

                  {(permisos.operaciones_ajustar_guias_permiso === 1 ||
                    permisos.operaciones_registro_envio_permiso === 1 ||
                    permisos.operaciones_registro_masivo_permiso === 1 ||
                    permisos.operaciones_programacion_permiso === 1 ||
                    permisos.operaciones_asignacion_recojo_permiso === 1 ||
                    permisos.operaciones_lista_recojo_permiso === 1 ||
                    permisos.operaciones_estado_permiso === 1 ||
                    permisos.operaciones_despacho_permiso === 1 ||
                    permisos.operaciones_consultas_permiso === 1 ||
                    permisos.operaciones_seguimiento_permiso === 1) && (
                    <div className="grupo2-hover cont-logo">
                      <p
                        onClick={() => setminimizar2(!minimizar2)}
                        className="items-hover titulo cursor-pointer"
                      >
                        Operaciones
                      </p>
                      {minimizar2 && (
                        <>
                          {permisos.operaciones_ajustar_guias_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-ajustarguias">Ajustar Guias</Link>
                            </p>
                          )}
                          {permisos.operaciones_registro_envio_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/home-registronenvio">
                                Registro de Envio
                              </Link>
                            </p>
                          )}
                          {permisos.operaciones_registro_masivo_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/home-registromasivo">
                                Registro Masivo
                              </Link>
                            </p>
                          )}
                          {permisos.operaciones_programacion_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-programacion">Programacion</Link>
                            </p>
                          )}
                          {permisos.operaciones_asignacion_recojo_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/home-asignacion">
                                Asignacion Recojo
                              </Link>
                            </p>
                          )}
                          {permisos.operaciones_lista_recojo_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-lista">Lista Recojo</Link>
                            </p>
                          )}
                          {permisos.operaciones_registro_carga_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/home-registrocarga">
                                Registro Carga
                              </Link>
                            </p>
                          )}
                          {permisos.operaciones_estado_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-estados">Estados</Link>
                            </p>
                          )}
                          {permisos.operaciones_despacho_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-despacho">Despacho</Link>
                            </p>
                          )}
                          {permisos.operaciones_consultas_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-consultas">Consultas</Link>
                            </p>
                          )}
                          {permisos.operaciones_seguimiento_permiso === 1 && (
                            <p className="items-hover">
                              <Link to="/home-seguimiento">Seguimiento</Link>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {minimizar3 ? (
                    <IconoUP
                      className="Minimizar z-[10]"
                      onClick={() => setminimizar3(false)}
                    />
                  ) : (
                    <IconoDown
                      className="Maximizar z-[10]"
                      onClick={() => setminimizar3(true)}
                    />
                  )}
                  {(permisos.comprobantes_panel_permiso === 1 ||
                    permisos.comprobantes_crear_factura_boleta_permiso === 1 ||
                    permisos.comprobantes_crear_guia_remision_permiso === 1 ||
                    permisos.comprobantes_crear_n_debito_permiso === 1 ||
                    permisos.comprobantes_documento_baja_permiso === 1 ||
                    permisos.comprobantes_reportes_permiso === 1) && (
                    <div className="grupo2-hover cont-logo">
                      <p
                        onClick={() => setminimizar3(!minimizar3)}
                        className="items-hover titulo cursor-pointer"
                      >
                        Comprobantes
                      </p>
                      {minimizar3 && (
                        <>
                          {permisos.comprobantes_panel_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/home-panel">Panel</Link>
                            </p>
                          )}
                          {permisos.comprobantes_crear_factura_boleta_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/homefacturaboleta">
                                Factura/Boleta
                              </Link>
                            </p>
                          )}
                          {permisos.comprobantes_crear_guia_remision_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/homecrearguiasremision">
                                Guia Remision
                              </Link>
                            </p>
                          )}
                          {permisos.comprobantes_crear_n_debito_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/homecrearcreditodebito">
                                N.Credito/Debito
                              </Link>
                            </p>
                          )}
                          {permisos.comprobantes_documento_baja_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/homeDocdeBaja">Documento de baja</Link>
                            </p>
                          )}
                          {permisos.comprobantes_reportes_permiso ===
                            1 && (
                            <p className="items-hover">
                              <Link to="/homereportes">Reportes</Link>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {permisos.liquidacion_permiso === 1 && (
                    <div className="grupo2-hover">
                      <Link
                        to="/home-clientes"
                        className="items-hover titulo cursor-pointer"
                      >
                        Liquidacion
                      </Link>
                    </div>
                  )}

                  {(permisos.administracion_usuario_permiso === 1 ||
                    permisos.administracion_cliente_permiso === 1 ||
                    permisos.administracion_proveedor_permiso === 1 ||
                    permisos.administracion_vehiculo_permiso === 1 ||
                    permisos.administracion_area_permiso === 1) && (
                    <div className="grupo2-hover">
                      <Link
                        to={
                          permisos.administracion_usuario_permiso === 1
                            ? "/crear-usuario"
                            : permisos.administracion_cliente_permiso === 1
                            ? "/crear-cliente"
                            : permisos.administracion_proveedor_permiso === 1
                            ? "/crear-proveedor"
                            : permisos.administracion_vehiculo_permiso === 1
                            ? "/crear-vehiculo"
                            : permisos.administracion_area_permiso === 1
                            ? "/crear-area"
                            : "/dashboard"
                        }
                        className="items-hover titulo3"
                      >
                        Administracion
                      </Link>
                    </div>
                  )}

                  {permisos.tarifarios_permiso === 1 && (
                    <div className="grupo2-hover">
                      <Link
                        to="/tarifario-cliente"
                        className="items-hover titulo3"
                      >
                        Tarifarios
                      </Link>
                    </div>
                  )}

                  {permisos.ajustes_permiso === 1 && (
                    <div className="grupo2-hover">
                      <Link to="/home-permiso" className="items-hover titulo3">
                        Permiso de Usuarios
                      </Link>
                    </div>
                  )}
                </div>
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
