// Importamos el createBrowserRouter y el RouterProvider de react-router-dom
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pagina por default
import DashBoard from "../Views/Dashboard/Default";

// Login
import Login from "../Views/Login/Login";

// Area de Administración
import Usuario from "../Views/Administración/Usuario/HomeUsuario";
import Cliente from "../Views/Administración/Cliente/HomeCliente";
import Area from "../Views/Administración/Area/HomeArea";
import Proveedor from "../Views/Administración/Proveedor/HomeProveedor";
import Vehiculo from "../Views/Administración/Vehiculo/HomeVehiculo";

// Area Tarifarios
import HomeFiltrarCliente from "../Views/Tarifarios/Cliente/Cliente";
import Agente from "../Views/Tarifarios/Agente/Agente";
import Transportista from "../Views/Tarifarios/Transportista/Transportista";

// Area de Comercial
import Cotizacion from "../Views/Comercial/Cotizacion/Cotizacion";
import PuntosVentas from "../Views/Comercial/PuntosVenta/PuntosVenta";
import Validacion from "../Views/Comercial/Validacion/HomeValidacion";

// Area de Liquidación
import HomeAgente from "../Views/Liquidacion/Agente/HomeAgente";
import HomeClientes from "../Views/Liquidacion/Cliente/HomeClientes";
import HomeTransporte from "../Views/Liquidacion/Transporte/HomeTransporte";
import HomeVendedor from "../Views/Liquidacion/Vendedor/HomeVendedor";

// Area de Operaciones
import HomeAsignacion from "../Views/Operaciones/AsignacionRecojo/HomeAsignacion";
import HomeConsultas from "../Views/Operaciones/Consultas/HomeConsultas";
import HomeDespacho from "../Views/Operaciones/Despacho/HomeDespacho";
import HomeEstados from "../Views/Operaciones/Estados/HomeEstados";
import HomeListaRecojo from "../Views/Operaciones/ListaRecojo/HomeLista";
import HomeProgramacion from "../Views/Operaciones/Programacion/HomeProg";
import HomeRegistroCarga from "../Views/Operaciones/RegistroCarga/HomeCarga";
import HomeRegistroEnvio from "../Views/Operaciones/RegistroEnvio/HomeEnvio";
import HomeRegistroMasivo from "../Views/Operaciones/RegistroMasivo/HomeMasivo";
import HomeSeguimiento from "../Views/Operaciones/Seguimiento/Seguimiento";

import AjustarGuias from "../Views/Operaciones/Ajustar Guias/AjustarGuias";

// Area de Comprobantes
import HomePanel from "../Views/Comprobantes/Panel/HomePanel";
import HomeFacturaBoleta from "../Views/Comprobantes/Crear Factura-Boleta/HomeFacturaBoleta";
import HomeCrearGuiaRemision from "../Views/Comprobantes/Crear GuiaRemision/HomeCrearGuiaRemision";
import HomeCreditoDebito from "../Views/Comprobantes/Crear Credito-Debito/HomeCreditoDebito";
import HomeDocDeBaja from "../Views/Comprobantes/Crear Doc de Baja/HomeDocDeBaja";
import HomeReportes from "../Views/Comprobantes/Reportes/HomeReportes";

// Area de Permisos
import HomePermisos from "../Views/Permisos/HomePermisos";
// Aca van sus componentes principales
// Pagina de Error para rutas no existentes
import Error from "../Views/Error/Error";

function MyRoutes({ loggedIn, setLoggedIn, permisos }) {
  // Constante donde crearemos las rutas
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login setLoggedIn={setLoggedIn} />,
      errorElement: <Error />,
    },

    // DashBoard
    {
      path: "/dashboard",
      element: loggedIn ? <DashBoard /> : <Navigate to="/" />,
    },

    //Administración

    ...(permisos.administracion_usuario_permiso !== 0
      ? [
          {
            path: "/crear-usuario",
            element: loggedIn ? <Usuario /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.administracion_cliente_permiso !== 0
      ? [
          {
            path: "/crear-cliente",
            element: loggedIn ? <Cliente /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.administracion_proveedor_permiso !== 0
      ? [
          {
            path: "/crear-proveedor",
            element: loggedIn ? <Proveedor /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.administracion_vehiculo_permiso !== 0
      ? [
          {
            path: "/crear-vehiculo",
            element: loggedIn ? <Vehiculo /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.administracion_area_permiso !== 0
      ? [
          {
            path: "/crear-area",
            element: loggedIn ? <Area /> : <Navigate to="/" />,
          },
        ]
      : []),

    //Comercial
    ...(permisos.comercial_cotizacion_permiso !== 0
      ? [
          {
            path: "/cotizacion",
            element: loggedIn ? <Cotizacion /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.comercial_punto_venta_permiso !== 0
      ? [
          {
            path: "/puntos-venta",
            element: loggedIn ? <PuntosVentas /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.comercial_validacion_permiso !== 0
      ? [
          {
            path: "/validacion",
            element: loggedIn ? <Validacion /> : <Navigate to="/" />,
          },
        ]
      : []),

    // Liquidacion
    ...(permisos.liquidacion_permiso !== 0
      ? [
          {
            path: "/home-agente",
            element: loggedIn ? <HomeAgente /> : <Navigate to="/" />,
          },
          {
            path: "/home-clientes",
            element: loggedIn ? <HomeClientes /> : <Navigate to="/" />,
          },
          {
            path: "/home-transporte",
            element: loggedIn ? <HomeTransporte /> : <Navigate to="/" />,
          },
          {
            path: "/home-vendedor",
            element: loggedIn ? <HomeVendedor /> : <Navigate to="/" />,
          },
        ]
      : []),

    //Tarifario
    ...(permisos.tarifarios_permiso !== 0
      ? [
          {
            path: "/tarifario-cliente",
            element: loggedIn ? <HomeFiltrarCliente /> : <Navigate to="/" />,
          },
          {
            path: "/tarifario-agente",
            element: loggedIn ? <Agente /> : <Navigate to="/" />,
          },
          {
            path: "/tarifario-transportista",
            element: loggedIn ? <Transportista /> : <Navigate to="/" />,
          },
        ]
      : []),

    // Operaciones
    ...(permisos.operaciones_ajustar_guias_permiso !== 0
      ? [
          {
            path: "/home-ajustarguias",
            element: loggedIn ? <AjustarGuias /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_asignacion_recojo_permiso !== 0
      ? [
          {
            path: "/home-asignacion",
            element: loggedIn ? <HomeAsignacion /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.operaciones_consultas_permiso !== 0
      ? [
          {
            path: "/home-consultas",
            element: loggedIn ? <HomeConsultas /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_despacho_permiso !== 0
      ? [
          {
            path: "/home-despacho",
            element: loggedIn ? <HomeDespacho /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_estado_permiso !== 0
      ? [
          {
            path: "/home-estados",
            element: loggedIn ? <HomeEstados /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_lista_recojo_permiso !== 0
      ? [
          {
            path: "/home-lista",
            element: loggedIn ? <HomeListaRecojo /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_programacion_permiso !== 0
      ? [
          {
            path: "/home-programacion",
            element: loggedIn ? <HomeProgramacion /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.operaciones_registro_carga_permiso !== 0
      ? [
          {
            path: "/home-registrocarga",
            element: loggedIn ? <HomeRegistroCarga /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.operaciones_registro_envio_permiso !== 0
      ? [
          {
            path: "/home-registronenvio",
            element: loggedIn ? <HomeRegistroEnvio /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.operaciones_registro_masivo_permiso !== 0
      ? [
          {
            path: "/home-registromasivo",
            element: loggedIn ? <HomeRegistroMasivo /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.operaciones_seguimiento_permiso !== 0
      ? [
          {
            path: "/home-seguimiento",
            element: loggedIn ? <HomeSeguimiento /> : <Navigate to="/" />,
          },
        ]
      : []),

    // COMPROBANTES
    ...(permisos.comprobantes_panel_permiso !== 0
      ? [
          {
            path: "/home-panel",
            element: loggedIn ? <HomePanel /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.comprobantes_crear_factura_boleta_permiso !== 0
      ? [
          {
            path: "/homefacturaboleta/:tab",
            element: loggedIn ? <HomeFacturaBoleta /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.comprobantes_crear_factura_boleta_permiso !== 0
      ? [
          {
            path: "/homefacturaboleta",
            element: loggedIn ? <HomeFacturaBoleta /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.comprobantes_crear_guia_remision_permiso !== 0
      ? [
          {
            path: "/homecrearguiasremision",
            element: loggedIn ? <HomeCrearGuiaRemision /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.comprobantes_crear_n_debito_permiso !== 0
      ? [
          {
            path: "/homecrearcreditodebito",
            element: loggedIn ? <HomeCreditoDebito /> : <Navigate to="/" />,
          },
        ]
      : []),
    ...(permisos.comprobantes_reportes_permiso !== 0
      ? [
          {
            path: "/homereportes",
            element: loggedIn ? <HomeReportes /> : <Navigate to="/" />,
          },
        ]
      : []),

    ...(permisos.comprobantes_documento_baja_permiso !== 0
      ? [
          {
            path: "/homeDocdeBaja",
            element: loggedIn ? <HomeDocDeBaja /> : <Navigate to="/" />,
          },
        ]
      : []),

    // PERMISOS
    ...(permisos.ajustes_permiso !== 0
      ? [
          {
            path: "/home-permiso",
            element: loggedIn ? <HomePermisos /> : <Navigate to="/" />,
          },
        ]
      : []),
  ]);

  return <RouterProvider router={routes} />;
}

export default MyRoutes;
