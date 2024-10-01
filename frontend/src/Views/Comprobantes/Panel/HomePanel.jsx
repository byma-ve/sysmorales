import React, { useEffect, useState } from "react";
import Home from "../../../Layout/Home";
import Logo from "../../../Static/Img_Pred/LogoOscuro.webp";
import { Link } from "react-router-dom";
import {
  IconoCrear,
  IconoDescargar,
  IconoInfo,
  Iconoverdocumento,
} from "../../../Iconos/Iconos-NavBar";
const HomePanel = () => {
  const [permisos, setPermisos] = useState("");

  useEffect(() => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Permisos/obtenerPermisos.php?dni_usuario=${localStorage.getItem(
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
      <Home
        children2={
          <>
            <div className=" w-full bg-white p-4  rounded-xl">
              <div className="1 grid grid-cols-[1fr,1.2fr,2fr] w-full gap-x-4 items-center  ">
                <div className=" rounded-md text-center w-full">
                  <img
                    src={Logo}
                    alt=""
                    className=" text-center items-center  "
                  />
                </div>
                <div className=" rounded-md space-y-2  p-4">
                  <h1 className="text-xl font-semibold">
                    ¡Hola, COMERCIAL ELIAS A & G S.A.C.!
                  </h1>
                  <p className="">
                    Bienvenido y gracias por elegir a Efact web. Empieza a
                    emitir tus comprobantes de manera fácil, rápida y segura.
                  </p>
                </div>
                <div className=" rounded-md flex justify-center bg-blue-400 p-4">
                  <div className="text-center space-y-3   flex flex-col justify-center">
                    <h1 className="text-white text-2xl font-semibold">
                      Código de tipo de unidad de medidad
                    </h1>
                    <p className="text-white text-sm ">
                      Conoce las novedades que BYMA-VE tiene para ti
                    </p>
                    <div>
                      <button className="content-center w-1/3  text-sm bg-white text-blue-600  from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br hover:text-white py-1 rounded-md ">
                        Mas Informacion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="2 grid grid-cols-[1.3fr,2fr] w-full gap-x-4 my-4 ">
                <div className=" shadow-lg rounded-b-lg ">
                  <h1 className="bg-blue-400 ps-4 py-2 text-white font-semibold text-lg rounded-t-lg">
                    Accesos Rapidos
                  </h1>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <Link
                      to={
                        permisos.comprobantes_crear_factura_boleta_permiso === 1
                          ? "/homefacturaboleta/Factura"
                          : "#"
                      }
                    >
                      <button
                        className={`${
                          permisos.comprobantes_crear_factura_boleta_permiso ===
                          1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_crear_factura_boleta_permiso ===
                            1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <IconoCrear />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Crear</p>
                          <p className="text-gray-500 font-semibold text-lg text-">
                            Factura
                          </p>
                        </div>
                      </button>
                    </Link>

                    <Link
                      to={
                        permisos.comprobantes_crear_factura_boleta_permiso === 1
                          ? "/homefacturaboleta/Boleta"
                          : "#"
                      }
                    >
                      {" "}
                      <button
                        className={`${
                          permisos.comprobantes_crear_factura_boleta_permiso ===
                          1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_crear_factura_boleta_permiso ===
                            1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <IconoCrear />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Crear</p>
                          <p className="text-gray-500 font-semibold text-lg">
                            Boleta
                          </p>
                        </div>
                      </button>
                    </Link>

                    <Link
                      to={
                        permisos.comprobantes_crear_guia_remision_permiso === 1
                          ? "/homecrearguiasremision"
                          : "#"
                      }
                    >
                      <button
                        className={`${
                          permisos.comprobantes_crear_guia_remision_permiso ===
                          1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_crear_guia_remision_permiso ===
                            1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <IconoCrear />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Crear</p>
                          <p className="text-gray-500 font-semibold text-lg ">
                            Guia Remision
                          </p>
                        </div>
                      </button>
                    </Link>
                    <Link
                      to={
                        permisos.comprobantes_crear_n_debito_permiso === 1
                          ? "/homecrearcreditodebito"
                          : "#"
                      }
                    >
                      {" "}
                      <button
                        className={`${
                          permisos.comprobantes_crear_n_debito_permiso === 1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_crear_n_debito_permiso === 1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <IconoCrear />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Crear</p>
                          <p className="text-gray-500 font-semibold text-lg">
                            N.Credito/Debito
                          </p>
                        </div>
                      </button>
                    </Link>
                    <Link
                      to={
                        permisos.comprobantes_documento_baja_permiso === 1
                          ? "/homeDocdeBaja"
                          : "#"
                      }
                    >
                      <button
                        className={`${
                          permisos.comprobantes_documento_baja_permiso === 1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_documento_baja_permiso === 1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <IconoCrear />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Crear</p>
                          <p className="text-gray-500 font-semibold text-lg">
                            Doc. baja
                          </p>
                        </div>
                      </button>
                    </Link>
                    <Link
                      to={
                        permisos.comprobantes_reportes_permiso === 1
                          ? "/homereportes"
                          : "#"
                      }
                    >
                      {" "}
                      <button
                        className={`${
                          permisos.comprobantes_reportes_permiso ===
                          1
                            ? "flex p-3 gap-x-2 items-center hover:text-blue-400"
                            : "flex p-3 gap-x-2 items-center hover:text-gray-300 cont-logo"
                        }`}
                      >
                        <div
                          className={`${
                            permisos.comprobantes_reportes_permiso ===
                            1
                              ? "text-[40px] text-gray-400 hover:text-blue-400 "
                              : "text-[40px] text-gray-300"
                          }`}
                        >
                          <Iconoverdocumento />
                        </div>
                        <div className="text-left items-center -space-y-2 hover:text-blue-400">
                          <p className="text-gray-500">Consultar</p>
                          <p className="text-gray-500 font-semibold text-lg">
                            Doc. Emitidos
                          </p>
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className=" shadow-lg  relative  rounded-xl">
                  <h1 className="bg-blue-400 ps-4 py-2 text-white font-semibold text-lg rounded-t-lg">
                    Ultimos Comprobantes Emitidos
                  </h1>{" "}
                  <div className="TABLA px-1 rounded-b-xl pb-1  max-h-[205px] overflow-auto ScrollTable">
                    <table className="w-full  p-4 ">
                      <thead className="font-medium text-gray-600">
                        <tr className=" ">
                          <td className="ps-4 py-2 text-left">
                            Nro. Comprobante
                          </td>
                          <td className="px-4 py-2 text-left">Tipo</td>
                          <td className="px-4 py-2 text-left">Monto</td>
                          <td className="px-4 py-2 text-left">Estado</td>
                          <td className="px-4 py-2 text-left">Factura</td>
                        </tr>
                      </thead>
                      <tbody className="w-full mt-4 text-md ">
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-whitehover:bg-gray-200   ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white  hover:bg-gray-200 ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white hover:bg-gray-200  ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                        <tr className="border-b bg-white  hover:bg-gray-200 ">
                          <td scope="row" className="px-4 py-1 text-gray-500">
                            asdas
                          </td>
                          <td className=" px-4 py-1 text-gray-500">1</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                          <td className=" px-4 py-1 text-gray-500">asd</td>
                        </tr>
                      </tbody>
                    </table>{" "}
                  </div>
                </div>
              </div>
              <div className="3 grid grid-cols-3 w-full gap-x-4  ">
                <div className=" rounded-md text-center w-full space-y-4 grid ">
                  <button className="bg-gray-500 hover:bg-gray-600 rounded-lg p-2 shadow-lg  text-white font-semibold content-center ">
                    <div className="text-left items-center -space-y-2  flex ms-10">
                      <div className="text-[60px] mx-2">
                        <IconoInfo />
                      </div>
                      <div className="items-center -space-y-2">
                        <p className="text-white text-[22px]">Preguntas</p>
                        <p className="text-white font-bold text-[25px]">
                          Frecuentes
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className=" rounded-md text-center w-full space-y-4 grid ">
                  <button className="bg-gray-500 hover:bg-gray-600 rounded-lg p-2 shadow-lg  text-white font-semibold content-center ">
                    <div className="text-left items-center -space-y-2  flex ms-10">
                      <div className="text-[60px] mx-2">
                        <IconoInfo />
                      </div>
                      <div className="items-center -space-y-2">
                        <p className="text-white text-[22px]">Preguntas</p>
                        <p className="text-white font-bold text-[25px]">
                          Frecuentes
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className=" rounded-md text-center w-full space-y-4 grid ">
                  <button className="bg-gray-500 hover:bg-gray-600 rounded-lg p-2 shadow-lg   text-white font-semibold content-center ">
                    <div className="text-left items-center -space-y-2  flex ms-10">
                      <div className="text-[60px] mx-2">
                        <IconoDescargar />
                      </div>
                      <div className="items-center -space-y-2">
                        <p className="text-white text-[22px]">Descarga el</p>
                        <p className="text-white font-bold text-[25px] ">
                          Manual de Usuario
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                {/* <div className=" rounded-md space-y-2 bg-black p-4 text-white min-h-[225px]">
                  VIDEO
                </div>
                <div className=" rounded-md space-y-2 bg-black p-4 text-white">
                  VIDEO
                </div> */}
              </div>
            </div>
          </>
        }
      >
        {" "}
      </Home>
    </>
  );
};

export default HomePanel;
