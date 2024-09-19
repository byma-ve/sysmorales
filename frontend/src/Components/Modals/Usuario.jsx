import { useEffect, useState } from "react";
import { BsBoxArrowInRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const Usuario = () => {
  const naviget = useNavigate();
  const [userData, setUserData] = useState(null);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) {
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtener_usuario.php?usuario=${encodeURIComponent(
          user
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }
  }, [user]);

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

    localStorage.setItem("login", "");
    localStorage.setItem("loginStatus", "¡Cerró sesión exitosamente!");
    naviget("/");
  }

  return (
    <>
      <div className="modal2 perfil-modal top-16 left-0  absolute flex w-[315px] p-[15px] bg-[rgba(247,248,249,.88)] rounded-xl text-[#535c69] z-10">
        <div className="modal2-content flex flex-col">
          {userData && (
            <div className="contern-datos relative w-[290px] bg-[#ffffff] rounded-[15px] text-left p-[15px]">
              <h1 className="nombres-conter text-[16px] text-[rgba(37,37,37,0.445)]">
                Nombre:
              </h1>
              <h1 className="apellidos-conter text-[16px] text-[rgba(37,37,37,0.445)]">
                {userData.colaborador_usuario}
              </h1>
              <h1 className="apellidos-conter text-[16px] text-[rgba(37,37,37,0.445)]">
                Area:
              </h1>
              <h1 className="campo-v2 text-[16px] text-[rgba(37,37,37,0.445)]">
                {userData.area_usuario}
              </h1>
              <h1 className="correo-elect text-[16px] text-[rgba(37,37,37,0.445)]">
                Correo electrónico:
              </h1>
              <h1 className="gmail-com text-[16px] text-[#0d6db1]">
                {userData.email_usuario}
              </h1>
              <h1 className="depart text-[16px] text-[rgba(37,37,37,0.445)]">
                Cargo:{" "}
                {userData.cargo_usuario &&
                  userData.cargo_usuario.charAt(0).toUpperCase() +
                    userData.cargo_usuario.slice(1)}
              </h1>
              <div className="finalizar-sesion flex mt-3 w-[65%] ml-[35%]">
                <BsBoxArrowInRight className="salida text-[28px] w-[11%] mr-2" />
                <h1
                  onClick={logoutSubmit}
                  className="salida-sesion w-[85%] text-[16px] font-bold"
                >
                  Finalizar la sesión
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
