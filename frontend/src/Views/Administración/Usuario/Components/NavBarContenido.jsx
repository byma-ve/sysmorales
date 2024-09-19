import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBarContenido = () => {
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
  }, []);

  return (
    <>
      <div className="cont-navbar relative  mb-3 bg-white rounded-2xl h-[60px] z-0">
        <div className="navbar w-full h-full flex justify-around text-black p-4 text-center">
          <Link
            to={
              permisos.administracion_usuario_permiso === 1
                ? "/crear-usuario"
                : "#"
            }
            className={`elmnts relative text-[15px] font-semibold no-underline transition-all ${
              permisos.administracion_usuario_permiso === 1
                ? "text-black hover:text-[#1058d0] "
                : "text-gray-300 cont-logo"
            }`}
          >
            Crear Usuario
          </Link>

          <Link
            to={
              permisos.administracion_cliente_permiso === 1
                ? "/crear-cliente"
                : "#"
            }
            className={`elmnts relative text-[15px] font-semibold no-underline transition-all ${
              permisos.administracion_cliente_permiso === 1
                ? "text-black hover:text-[#1058d0] "
                : "text-gray-300 cont-logo"
            }`}
          >
            Crear Cliente
          </Link>

          <Link
            to={
              permisos.administracion_proveedor_permiso === 1
                ? "/crear-proveedor"
                : "#"
            }
            className={`elmnts relative text-[15px] font-semibold no-underline transition-all ${
              permisos.administracion_proveedor_permiso === 1
                ? "text-black hover:text-[#1058d0] "
                : "text-gray-300 cont-logo"
            }`}
          >
            Crear Proveedor
          </Link>

          <Link
            to={
              permisos.administracion_vehiculo_permiso === 1
                ? "/crear-vehiculo"
                : "#"
            }
            className={`elmnts relative text-[15px] font-semibold no-underline transition-all ${
              permisos.administracion_vehiculo_permiso === 1
                ? "text-black hover:text-[#1058d0] "
                : "text-gray-300 cont-logo"
            }`}
          >
            Crear Vehiculo
          </Link>

          <Link
            to={
              permisos.administracion_area_permiso === 1 ? "/crear-area" : "#"
            }
            className={`elmnts relative text-[15px] font-semibold no-underline transition-all ${
              permisos.administracion_area_permiso === 1
                ? "text-black hover:text-[#1058d0] "
                : "text-gray-300 cont-logo"
            }`}
          >
            Crear Area
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBarContenido;
