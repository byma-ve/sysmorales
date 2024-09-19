import { useState, useEffect, useContext } from "react";
import LogoBlanco from "../Static/Img_Pred/LogoBlanco.webp";
import { IconoAlerta } from "../Iconos/Iconos-NavBar";
import { useNavigate } from "react-router-dom";
import { Notificaciones } from "./Notificaciones";
import { UserContext } from "../Context/UserContext";
import Configuracion from "./Modals/Configuracion";
import { IconoCerrarSesion, IconoEngrane2 } from "../Iconos/Iconos-NavBar";
import { Avatar } from "@nextui-org/react";
function Encabezado() {
  const [modalNotificaciones, setModalNotificaciones] = useState(false);
  const [modalConfiguracion, setModalConfiguracion] = useState(false);

  // Llamo a mi context de usuario para acceder a mis datos
  const { userData, hora } = useContext(UserContext);

  // Funcionalidad del Modal de Notificaciones
  const mostrarModalNotificaciones = () => {
    setModalNotificaciones(true);
  };
  const mostrarModalConfiguracion = () => {
    setModalConfiguracion(true);
  };

  const naviget = useNavigate();

  function logoutSubmit() {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/estadoDesconectado.php?id=${encodeURIComponent(
        localStorage.getItem("id_usuario")
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar el estado desconectado");
        }
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
      });

    localStorage.removeItem("login");
    localStorage.setItem("loginStatus", "¡Cerró sesión exitosamente!");
    naviget("/");
  }

  useEffect(() => {
    if (localStorage.getItem("id_usuario")) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/estadoConectado.php?id=${encodeURIComponent(
          localStorage.getItem("id_usuario")
        )}`
      )
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }
  }, [localStorage.getItem("id_usuario")]);

  const [conteoNotifiaciones, setConteoNotifiaciones] = useState("");

  const cargarConteoNotificaciones = async () => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Notificaciones/obtenerConteoNotificaciones.php?id_usuario=${encodeURIComponent(
          localStorage.getItem("id_usuario")
        )}`
      );
      const data = await response.json();
      setConteoNotifiaciones(data);
    } catch (error) {
      console.error(
        "Error al obtener conteo de notificaciones del usuario:",
        error
      );
    }
  };

  return (
    <>
      <div className="encabezado-cont   relative flex justify-between items-center w-full  pl-[65px] ">
        <div className="encabezado relative grid grid-cols-[2fr,1fr,2fr] items-center h-[73px] w-full ">
          <div className="cont-logo w-[190px]  ">
            <img src={LogoBlanco} alt="Byma-Ve" className="logo    " />
          </div>
          <div className="  text-center cont-logo">
            <button className=" Reloj   items-center cursor-default">
              <span className="hora w-full text-3xl text-white">{hora}</span>
            </button>
          </div>
          <div className="flex   items-center cont-logo">
            <div className="FotoyUsuario relative h-full flex justify-end  items-center bg-transparent border-none rounded-xl   w-full  z-10 ">
              <div className="w-[12%] max-w-[8%] mr-4 cont-logo">
                {userData && (
                  <Avatar
                    alt={userData.colaborador_usuario}
                    src={`https://images.weserv.nl/?url=${userData.foto_usuario}`}
                    size="small"
                  />
                )}
              </div>
              {userData && (
                <span className="nombre text-white text-[20px] mr-10  p-[4px_0]  whitespace-nowrap">
                  {userData.colaborador_usuario}
                </span>
              )}
            </div>
            <button
              onClick={mostrarModalNotificaciones}
              className="tema flex text-white text-[30px] mr-10 "
              style={{ animation: "moveAndRotateNotification 1.3s infinite" }}
            >
              <IconoAlerta />
              <span className="bg-red-500 rounded-[100%] text-xs absolute ml-5 px-[2px] pr-[3.5px]">
                {conteoNotifiaciones.conteo_notis
                  ? conteoNotifiaciones.conteo_notis
                  : ""}
              </span>
            </button>
            <button
              onClick={mostrarModalConfiguracion}
              className="tema flex text-white text-[30px] mr-10 "
              style={{ animation: "moveAndRotateEngrane 3.3s infinite" }}
            >
              <IconoEngrane2 />
            </button>
            <button
              onClick={logoutSubmit}
              className="flex text-center text-white items-center gap-2 mr-[7%] px-4 hover:bg-opacity-20 hover:bg-neutral-100 rounded-lg "
            >
              <IconoCerrarSesion />
              <p>Salir</p>
            </button>
          </div>
        </div>
      </div>

      <Notificaciones
        cargarConteoNotificaciones={cargarConteoNotificaciones}
        modalNotificaciones={modalNotificaciones}
        setModalNotificaciones={setModalNotificaciones}
      />
      <Configuracion
        modalConfiguracion={modalConfiguracion}
        setModalConfiguracion={setModalConfiguracion}
      />
    </>
  );
}

export default Encabezado;
