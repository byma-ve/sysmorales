import React from "react";
import { IconoCampana, IconoMensaje } from "../../../../Iconos/Iconos-NavBar";
import FondoComentario from "../../../../Static/Img_Pred/FondoNotificacion.jpg";

const ModalComentario = ({ open, setOpen }) => {
  const cerrarModal = () => {
    setOpen(false);
  };
  return (
    <div
      className={`side-panel-container ${
        open ? "visible" : "invisible"
      } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center`}
    >
      <div
        className={`side-panel-cont-container ${
          open ? "translate-y-0" : "translate-y-[600%]"
        } w-[500px] block absolute transition-transform duration-500`}
      >
        {/* <div
          className="flex items-center justify-center 2xl:h-[93%] xl:h-[92.4%] lg:h-[89%] md:h-[87%] sm:h-[85%] h-[83%]    "
          style={{
            // Set the height
            background: `url(${FondoComentario})`, // Set the background image
            backgroundSize: "", // Adjust this property as needed
            borderRadius: "0px 0px 10px 10px",
          }}
        >
          <div className="side-panel-iframe h-full  ">
            <div className="  h-96 bg-gradient-to-r rounded-[15px]  border bg-[rgba(255,255,255,0.35)]    ">
              <div className=" p-6 rounded-lg">
                <textarea
                  className="w-full focus:ring-2 outline-0 no-underline  max-h-[335px] min-h-[335px] rounded-lg p-2"
                  name=""
                  id=""
                ></textarea>
              </div>
              <div className="flex items-center justify-end mt-4  "></div>
            </div>
          </div>
        </div> */}

        <div
          className="flex items-center justify-center   p-2   "
          style={{
            // Set the height
            background: `url(${FondoComentario})`, // Set the background image
            backgroundSize: "", // Adjust this property as needed
            borderRadius: "10px",
          }}
        >
          <div className="w  h-96 bg-gradient-to-r rounded-lg  border bg-[rgba(255,255,255,0.35)] ">
            <div className="flex flex-row justify-between items-center ">
              <div className="flex mb-4">
                <div className="flex flex-col mt-2 ms-[220px]">
                  <label className="text-lg font-normal text-white"></label>
                </div>
              </div>
              <div className="flex justify-end ">
                <button
                  onClick={cerrarModal}
                  data-modal-hide="default-modal"
                  type="button"
                  className="text-gray-200  from-gray-100 via-gray-200 to-gray-300 hover:bg-[rgba(255,255,255,0.25)] focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-2xl text-center mt-1 px-1 py-0  font-bold mr-2  "
                >
                  X
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center  rounded-md">
              <div className="mensaje">
                <IconoMensaje className="text-5xl text-white" />
              </div>
            </div>
            <div className="flex mb-4 mt-2 justify-center  ScrollTable  max-h-[16rem]">
              <div className="flex flex-col  -ms-6 text-center w-full">
                {/* Etiqueta para la fecha vigente */}
                <label className="text-lg font-normal mt-3 text-white "></label>

                <div className="text-center ms-7 text-[22px] font-medium  text-white uppercase ">
                  Comentario
                  <div className="text-[14px] font-normal   mb-4 -mt-5 p-8  normal-case">
                    Espero que estés bien. Estoy en busca de un proyecto para
                    trabajar y me gustaría saber si hay alguna tarea o proyecto
                    específico en el que pueda contribuir. Estoy disponible y
                    listo para ponerme manos a la obra. ¿Hay algo en particular
                    en lo que necesites ayuda o en lo que pueda colaborar?
                  </div>
                </div>
                {/* Contenedor para la fecha */}
                <div className="flex -mt-3 "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComentario;
