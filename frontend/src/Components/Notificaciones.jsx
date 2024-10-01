import { useState, useEffect } from "react";
import {
  IconoEditorLapiz,
  IconoLupa1,
  IconoEnvio,
} from "../Iconos/Iconos-NavBar";

import { CrearNotificacion } from "./Modals/CrearNotificacion";
import { Clientes } from "./Modals/Clientes";
import { ListadoNotificaciones } from "./Components/ListadoNotificaciones";
import { MostrarNotificacion } from "./Components/MostrarNotificacion";

export const Notificaciones = ({
  modalNotificaciones,
  setModalNotificaciones,
  cargarConteoNotificaciones,
}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("recibidos");
  const [userData, setUserData] = useState([]);
  const id_usuario = localStorage.getItem("id_usuario");
  const cargarNotificaciones = async () => {
    if (id_usuario) {
      try {
        const urlBase = "https://sistema.transportesmorales-logistik.com/BackendApiRest/Notificaciones/";
        const url =
          opcionSeleccionada === "recibidos"
            ? `${urlBase}mostrarNotificaciones.php?id_usuario=${encodeURIComponent(
                id_usuario
              )}`
            : `${urlBase}mostrarNotificacionesEnviados.php?id_usuario=${encodeURIComponent(
                id_usuario
              )}`;

        const response = await fetch(url);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener notificaciones del usuario:", error);
      }
    }
  };

  // Estado para apertura y cierre del Modal de Alerta
  const [modalAlerta, setModalAlerta] = useState(false);
  // Estado para mostrar y ocultar las notificaciones
  const [mostrarMarcar, setMostrarMarcar] = useState(false);
  // Estado para apertura y cierre del Modal de Clientes
  const [modalClientes, setModalClientes] = useState(false);
  // Estado para capturar los usuarios
  const [usuarios, setUsuarios] = useState("");
  // Estado que almacena la notificacion clickeada
  // Estado para almacenar los datos del formulario de CrearAlerta.jsx
  const [clienteData, setClienteData] = useState({
    tituloNotificacion: "",
    fechaVigente: "",
    usuarios: "",
    mensaje: "",
    id_receptor: "",
    id_emisor: localStorage.getItem("id_usuario"),
  });
  // Estado para almacenar el modal con el nombre de los usuarios
  const [nombresUsuarios, setNombresUsuarios] = useState(false);

  // Estado para almacenar las notificaciones creadas
  const [notificacionesData, setNotificacionesData] = useState([]);

  const modalMarcarNotificaciones = () => {
    setMostrarMarcar(!mostrarMarcar);
  };

  // Funcion para mostrar Modal de Crear Alerta
  const mostrarModalAlerta = () => {
    setModalAlerta(true);
  };

  // Funcion para ocultar el Modal de Crear Alerta
  const ocultarModalAlerta = () => {
    setModalAlerta(false);
  };

  // Funcion para mostrar el Modal de Clientes
  const mostrarModalClientes = () => {
    setModalClientes(true);
  };

  // Funcion para crear una nueva notificacion
  const agregarNuevaAlerta = (nuevaAlerta) => {
    setNotificacionesData([...notificacionesData, nuevaAlerta]);
  };

  // Funcio de clickear en un notification
  const handleClickNotification = (notification) => {
    setSelectedNotification(notification);
  };

  useEffect(() => {
    if (
      opcionSeleccionada === "recibidos" &&
      selectedNotification?.id != null &&
      selectedNotification?.visto_notificacion != null &&
      selectedNotification?.visto_notificacion !== "1"
    ) {
      fetch(
        `https://sistema.transportesmorales-logistik.com/BackendApiRest/Notificaciones/actualizarVisto.php?id=${encodeURIComponent(
          selectedNotification?.id
        )}`
      )
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.error("Error al actualizar visto:", error);
        });
    }
  }, [selectedNotification?.id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      cargarNotificaciones();
      cargarConteoNotificaciones();
    };

    const cargarNotificacionesInicial = setTimeout(fetchNotifications, 1000);

    const cargarNotificacionesInterval = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(cargarNotificacionesInterval);
      clearTimeout(cargarNotificacionesInicial);
    };
  }, [opcionSeleccionada, selectedNotification?.id]);

  useEffect(() => {
    const cargarNotificacionesInicial = setTimeout(() => {
      if (
        opcionSeleccionada === "recibidos" &&
        selectedNotification?.id != null &&
        selectedNotification?.visto_notificacion != null &&
        selectedNotification?.visto_notificacion !== "1"
      ) {
        fetch(
          `https://sistema.transportesmorales-logistik.com/BackendApiRest/Notificaciones/actualizarVisto.php?id=${encodeURIComponent(
            selectedNotification?.id
          )}`
        )
          .then((response) => response.json())
          .then((data) => {})
          .catch((error) => {
            console.error("Error al actualizar visto:", error);
          });
      }
    }, 1000);

    return () => clearTimeout(cargarNotificacionesInicial);
  }, [selectedNotification?.id]);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <>
      <div
        className={`side-panel-container ${
          modalNotificaciones ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-[11]`}
      >
        <div
          className={`side-panel-cont-container ${
            modalNotificaciones ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[800px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 z-[12]`}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 p-0 ">
            <div className="side-panel-iframe relative w-full h-full">
              <div className="side-panel  p-[0_15px_21px_21px] h-full w-auto m-0 ">
                <div className="side-cont-titulo p-[12px_0] text-[25px] font-medium text-slate-900 opacity-80"></div>
                <div className="h-full w-full">
                  <div className="section-crm w-full h-[95%]">
                    <div className="card-container h-full w-full">
                      <div className="flex w-full h-full">
                        <div className=" mr-15 rounded-t-[10px] w-[45%] bg-white ">
                          <div className="cont-titulo flex mb-3 px-3 w-full border-b-[1px] p-3 border-gray-200 border-solid ">
                            <div
                              onClick={modalMarcarNotificaciones}
                              className=" transform scale-110  text-[22px] text-blue-400 z-[999999999999999] relative"
                            >
                              <IconoEnvio className="mt-[7px]" />

                              {mostrarMarcar && (
                                <div className="absolute z-50 bg-sky-50 rounded-lg shadow text-left mt-[20px]">
                                  <ul className="p-3 overflow-y-auto text-gray-200">
                                    <div
                                      className="flex ps-2 rounded hover:bg-gray-200 cursor-pointer"
                                      onClick={() => {
                                        setOpcionSeleccionada("recibidos");
                                        setMostrarMarcar(false);
                                        setSelectedNotification(null);
                                      }}
                                    >
                                      <label className="w-full py-2 px-2 text-sm font-medium text-gray-800 rounded whitespace-nowrap">
                                        Marcar Recibidos
                                      </label>
                                    </div>
                                    <div
                                      className="flex items-center ps-2 rounded hover:bg-gray-200 cursor-pointer"
                                      onClick={() => {
                                        setOpcionSeleccionada("enviados");
                                        setMostrarMarcar(false);
                                        setSelectedNotification(null);
                                      }}
                                    >
                                      <label className="w-full py-2 px-2 text-sm font-medium text-gray-900 rounded whitespace-nowrap">
                                        Marcar Enviados
                                      </label>
                                    </div>
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="cont-txt text-slate-800 text-xl font-light relative">
                              <div className="cont-busqueda flex w-full rounded-[45px] border ms-3 border-blue-300 placeholder:text-sm ">
                                <div className="hijo text-slate-400 bg-none  mt-2  ml-3 text-[18px] w-[10%]  ">
                                  <IconoLupa1 />
                                </div>

                                <input
                                  type="text"
                                  className="barra bg-transparent text-slate-800 text-[14px] h-[34px]  outline-none"
                                  placeholder="Buscar un empleo o chat"
                                  value={searchQuery}
                                  onChange={handleSearch}
                                />
                              </div>
                            </div>
                            <div
                              className="icono p-1 mt-1 transform scale-105 ml-auto text-2xl text-blue-400 cursor-pointer"
                              onClick={mostrarModalAlerta}
                            >
                              <IconoEditorLapiz />
                            </div>
                          </div>
                          <ListadoNotificaciones
                            notificacionesData={userData.filter(
                              (notification) =>
                                notification.titulo_notificacion
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                            )}
                            handleClickNotification={handleClickNotification}
                            nombresUsuarios={nombresUsuarios}
                            setNombresUsuarios={setNombresUsuarios}
                          />
                        </div>
                        <MostrarNotificacion
                          titulo={selectedNotification?.titulo_notificacion}
                          fecha={
                            selectedNotification?.fecha_vigencia_notificacion
                          }
                          mensaje={selectedNotification?.mensaje_notificacion}
                          setModalNotificaciones={setModalNotificaciones}
                        />
                      </div>
                      <div className=" sticky h-20 bg-slate-100 w-ful pt-1">
                        {" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CrearNotificacion
        cargarNotificaciones={cargarNotificaciones}
        modalAlerta={modalAlerta}
        ocultarModalAlerta={ocultarModalAlerta}
        mostrarModalClientes={mostrarModalClientes}
        clienteData={clienteData}
        setClienteData={setClienteData}
        setUsuarios={setUsuarios}
        agregarNuevaAlerta={agregarNuevaAlerta}
      />
      <Clientes
        modalClientes={modalClientes}
        setModalClientes={setModalClientes}
        clienteData={clienteData}
        setClienteData={setClienteData}
        setUsuarios={setUsuarios}
      />
    </>
  );
};
