import { IconoCampana, IconoMensaje } from "../../Iconos/Iconos-NavBar";
import FondoNotificacion from "../../Static/Img_Pred/FondoNotificacion.jpg";

export const MostrarNotificacion = ({
  fecha,
  titulo,
  mensaje,
  setModalNotificaciones,
}) => {
  // Funcion para ocultar el Modal de Notificaciones
  const ocultarModalNotificaciones = () => {
    setModalNotificaciones(false);
    cargarConteoNotificaciones();
  };
  return (
    <>
      <div className="w-[57%] ml-3  ">
        <div className="border-b-[0px] p-[2.2%] pr-0 border-gray-200 border-solid rounded-t-[10px]  bg-white ">
          <div className="flex justify-between items-center ">
            <div className="flex items-center ">
              <div className="">
                <IconoCampana className=" mt-2 ml-1  text-blue-400 scale-150  " />
              </div>

              <div className=" py-[6px]  ms-6 text-lg font-semibold dark:text-gray-400">
                Notificaciones
              </div>
            </div>
            <div className="flex  justify-end rounded-b  ">
              <button
                onClick={ocultarModalNotificaciones}
                data-modal-hide="default-modal"
                type="button"
                className="text-blue-400  from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-2xl text-center  px-2 py-1  font-bold mr-2 focus:translate-x-1 "
              >
                X
              </button>
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-center 2xl:h-[93%] xl:h-[92.4%] lg:h-[89%] md:h-[87%] sm:h-[85%] h-[83%]    "
          style={{
            // Set the height
            background: `url(${FondoNotificacion})`, // Set the background image
            backgroundSize: "", // Adjust this property as needed
            borderRadius: "0px 0px 10px 10px",
          }}
        >
          <div className="w-10/12  h-96 bg-gradient-to-r rounded-[15px]  border bg-[rgba(255,255,255,0.35)] ">
            <div className="flex flex-row justify-between items-center ">
              <div className="flex mb-4">
                <div className="flex flex-col mt-2 ms-[220px]">
                  <label className="text-lg font-normal text-white"></label>

                  <h3 className="mt-2 p-1 mb-2 w-[120px] text-xs text-gray-100 focus:outline-none bg-[rgba(7,7,7,0.27)] font-sans text-center border-none rounded-md">
                    {fecha ? fecha : "¡Fecha Vigente!"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center -mt-5 rounded-lg">
              <div className="mensaje">
                <IconoMensaje className="text-5xl text-white" />
              </div>
            </div>

            <div className="flex mb-4 mt-2 justify-center  ScrollTable  max-h-[16rem]">
              <div className="flex flex-col  -ms-6 text-center w-full">
                {/* Etiqueta para la fecha vigente */}
                <label className="text-lg font-normal mt-3 text-white "></label>

                <div className="text-center ms-7 text-[22px] font-medium  text-white uppercase ">
                  {titulo ? titulo : "Titulo de Notificacion"}
                  <div className="text-[14px] font-normal   mb-4 -mt-5 p-8  normal-case">
                    {mensaje
                      ? mensaje
                      : "Espero que estés bien. Estoy en busca de un proyecto para trabajar y me gustaría saber si hay alguna tarea o proyecto específico en el que pueda contribuir. Estoy disponible y listo para ponerme manos a la obra. ¿Hay algo en particular en lo que necesites ayuda o en lo que pueda colaborar? "}
                  </div>
                </div>
                {/* Contenedor para la fecha */}
                <div className="flex -mt-3 "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
