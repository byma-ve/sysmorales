import Home from "../../../Layout/Home";
import Logo from "../../../Static/Img_Pred/LogoOscuro.webp";
import Swal from "sweetalert2";
import { IconoGuardar, IconoNumeros } from "../../../Iconos/Iconos-NavBar";
import { useEffect, useState } from "react";
const AjustarGuias = () => {
  const [abreviatura, setAbreviatura] = useState("");
  const [valorAdicional, setValorAdicional] = useState("");

  const [cotizacion, setCotizacion] = useState({
    identificador: "",
    nombre: "cotizacion",
  });
  const [puntoVenta, setPuntoVenta] = useState({
    identificador: "",
    nombre: "puntoVenta",
  });
  const [ordenServicio, setOrdenServicio] = useState({
    identificador: "",
    nombre: "ordenServicio",
  });
  const [ordenServicioMasivo, setOrdenServicioMasivo] = useState({
    identificador: "",
    nombre: "ordenServicioMasivo",
  });
  const [guiaCarga, setGuiaCarga] = useState({
    identificador: "",
    nombre: "guiaCarga",
  });
  const [guiaAereo, setGuiaAereo] = useState({
    identificador: "",
    nombre: "guiaAereo",
  });
  const [guiaValorizado, setGuiaValorizado] = useState({
    identificador: "",
    nombre: "guiaValorizado",
  });
  const [guiaCourrier, setGuiaCourrier] = useState({
    identificador: "",
    nombre: "guiaCourrier",
  });

  const [disabledCotizacion, setDisabledCotizacion] = useState(false);
  const [disabledPuntoVenta, setDisabledPuntoVenta] = useState(false);
  const [disabledOrdenServicio, setDisabledOrdenServicio] = useState(false);
  const [disabledOrdenServicioMasivo, setDisabledOrdenServicioMasivo] =
    useState(false);
  const [disabledGuiaCarga, setDisabledGuiaCarga] = useState(false);
  const [disabledGuiaAereo, setDisabledGuiaAereo] = useState(false);
  const [disabledGuiaValorizado, setDisabledGuiaValorizado] = useState(false);
  const [disabledGuiaCourrier, setDisabledGuiaCourrier] = useState(false);

  const obtenerDatos = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/AjustarGuias/obtenerAjustes.php"
      );
      const result = await response.json();

      if (Array.isArray(result)) {
        const cotizacion = result.find(
          (item) => item.nombre === "cotizacion"
        ) || {
          identificador: "",
          nombre: "cotizacion",
        };
        const puntoVenta = result.find(
          (item) => item.nombre === "puntoVenta"
        ) || {
          identificador: "",
          nombre: "puntoVenta",
        };
        const ordenServicio = result.find(
          (item) => item.nombre === "ordenServicio"
        ) || {
          identificador: "",
          nombre: "ordenServicio",
        };
        const ordenServicioMasivo = result.find(
          (item) => item.nombre === "ordenServicioMasivo"
        ) || {
          identificador: "",
          nombre: "ordenServicioMasivo",
        };
        const guiaCarga = result.find(
          (item) => item.nombre === "guiaCarga"
        ) || {
          identificador: "",
          nombre: "guiaCarga",
        };
        const guiaAereo = result.find(
          (item) => item.nombre === "guiaAereo"
        ) || {
          identificador: "",
          nombre: "guiaAereo",
        };
        const guiaValorizado = result.find(
          (item) => item.nombre === "guiaValorizado"
        ) || {
          identificador: "",
          nombre: "guiaValorizado",
        };
        const guiaCourrier = result.find(
          (item) => item.nombre === "guiaCourrier"
        ) || {
          identificador: "",
          nombre: "guiaCourrier",
        };

        // Establecer los estados
        setCotizacion(cotizacion);
        setPuntoVenta(puntoVenta);
        setOrdenServicio(ordenServicio);
        setOrdenServicioMasivo(ordenServicioMasivo);
        setGuiaCarga(guiaCarga);
        setGuiaAereo(guiaAereo);
        setGuiaValorizado(guiaValorizado);
        setGuiaCourrier(guiaCourrier);

        // Establecer los valores de los disabled
        setDisabledCotizacion(cotizacion.identificador !== "");
        setDisabledPuntoVenta(puntoVenta.identificador !== "");
        setDisabledOrdenServicio(ordenServicio.identificador !== "");
        setDisabledOrdenServicioMasivo(
          ordenServicioMasivo.identificador !== ""
        );
        setDisabledGuiaCarga(guiaCarga.identificador !== "");
        setDisabledGuiaAereo(guiaAereo.identificador !== "");
        setDisabledGuiaValorizado(guiaValorizado.identificador !== "");
        setDisabledGuiaCourrier(guiaCourrier.identificador !== "");
      } else {
        console.error("La respuesta no es un array.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("identificador_configuracion_guia", abreviatura);
    formData.append("nombre_configuracion_guia", valorAdicional);

    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "transparent",
      html: `
        <div class="papapa"> 
          <div class="loader1"> 
            <h1 class="guardado">Guardando...</h1>
          </div>
          <div class="loader2">
            <div class="justify-content-center jimu-primary-loading"></div>
          </div>
        </div>
      `,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/AjustarGuias/guardarAjuste.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      setValorAdicional("");
      setAbreviatura("");
      obtenerDatos();
      console.log(responseData.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
  };

  useEffect(() => {
    if (valorAdicional !== "") {
      handleSubmit();
    }
  }, [valorAdicional]);

  const handleButtonClick = (valor) => {
    setValorAdicional(valor);
  };
  const handleChange = (setter) => (e) => {
    setter((prev) => ({ ...prev, identificador: e.target.value }));
  };

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
                      <button className="text-blue-500 content-center w-1/3  text-sm bg-white font-semibold   py-1 rounded-md ">
                        Mas Informacion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5">
                <div className="2 grid grid-cols-1 w-full gap-x-4 my-4  rounded-xl ">
                  <div className=" shadow-lg rounded-b-lg ">
                    <h1 className="bg-blue-400 ps-4 py-2 text-white font-semibold text-lg rounded-t-lg">
                      Configuracion de Numeros
                    </h1>
                    <div className="grid grid-cols-1 gap-2 py-2">
                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3   gap-x-2 items-center    cursor-default ">
                          <div className="text-[40px] text-gray-400 ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Numero</p>
                            <p className="text-gray-500 font-semibold text-base">
                              Cotizacion
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              maxLength={4}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={cotizacion.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setCotizacion)(event);
                              }}
                              disabled={disabledCotizacion}
                            />
                            <label className="  peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] ">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledCotizacion}
                            onClick={() => handleButtonClick("cotizacion")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center   cursor-default ">
                          <div className="text-[40px] text-gray-400 ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Numero</p>
                            <p className="text-gray-500 font-semibold text-base ">
                              Punto de Venta
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5  items-center">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={4}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={puntoVenta.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setPuntoVenta)(event);
                              }}
                              disabled={disabledPuntoVenta}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] ">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledPuntoVenta}
                            onClick={() => handleButtonClick("puntoVenta")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center    cursor-default ">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Numero</p>
                            <p className="text-gray-500 font-semibold ">
                              Orden de Servicio U.
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={4}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={ordenServicio.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setOrdenServicio)(event);
                              }}
                              disabled={disabledOrdenServicio}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] ">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledOrdenServicio}
                            onClick={() => handleButtonClick("ordenServicio")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center    cursor-default ">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Numero</p>
                            <p className="text-gray-500 font-semibold ">
                              Orden de Servicio M.
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={4}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={ordenServicioMasivo.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setOrdenServicioMasivo)(event);
                              }}
                              disabled={disabledOrdenServicioMasivo}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0]">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledOrdenServicioMasivo}
                            onClick={() =>
                              handleButtonClick("ordenServicioMasivo")
                            }
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="2 grid grid-cols-1 w-full gap-x-4 my-4 bg ">
                  <div className=" shadow-lg rounded-b-lg ">
                    <h1 className="bg-blue-400 ps-4 py-2 text-white font-semibold text-lg rounded-t-lg">
                      Configuracion de Guias
                    </h1>
                    <div className="grid grid-cols-1 gap-2 py-2">
                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center     cursor-default">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Guias</p>
                            <p className="text-gray-500 font-semibold ">
                              Tracking Carga
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={5}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={guiaCarga.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setGuiaCarga)(event);
                              }}
                              disabled={disabledGuiaCarga}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0]">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledGuiaCarga}
                            onClick={() => handleButtonClick("guiaCarga")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center   cursor-default  ">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Guias</p>
                            <p className="text-gray-500 font-semibold ">
                              Tracking Aereo
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={5}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={guiaAereo.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setGuiaAereo)(event);
                              }}
                              disabled={disabledGuiaAereo}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0]">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledGuiaAereo}
                            onClick={() => handleButtonClick("guiaAereo")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center   cursor-default  ">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500 text-sm">Guias</p>
                            <p className="text-gray-500 font-semibold">
                              Tracking Valorizado
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={5}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={guiaValorizado.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setGuiaValorizado)(event);
                              }}
                              disabled={disabledGuiaValorizado}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0]">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledGuiaValorizado}
                            onClick={() => handleButtonClick("guiaValorizado")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr,1.5fr] items-center">
                        <button className="flex p-3 gap-x-2 items-center    cursor-default ">
                          <div className="text-[40px] text-gray-400  ">
                            <IconoNumeros />
                          </div>
                          <div className="text-left items-center -space-y-2 ">
                            <p className="text-gray-500  text-sm">Guias</p>
                            <p className="text-gray-500 font-semibold">
                              Tracking Courier
                            </p>
                          </div>
                        </button>
                        <div className="flex w-full justify-start gap-x-5 items-center ">
                          <div className="relative z-0 w-[20%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                              maxLength={5}
                              onInput={(event) => {
                                event.target.value =
                                  event.target.value.toUpperCase();
                              }}
                              value={guiaCourrier.identificador}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                setAbreviatura(newValue);
                                handleChange(setGuiaCourrier)(event);
                              }}
                              disabled={disabledGuiaCourrier}
                            />
                            <label className="peer-focus:font-medium absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Abreviatura
                            </label>
                          </div>
                          -
                          <div className="relative z-0 w-[20%] group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="0000000001"
                              readOnly
                            />
                            <label className="absolute text-[10px] text-gray-500 duration-300 transform   -top-[10px] -z-10 origin-[0]">
                              Correlativo
                            </label>
                          </div>
                          <button
                            disabled={disabledGuiaCourrier}
                            onClick={() => handleButtonClick("guiaCourrier")}
                            className="text-2xl text-blue-400 hover:text-blue-500"
                          >
                            <IconoGuardar />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>{" "}
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

export default AjustarGuias;
