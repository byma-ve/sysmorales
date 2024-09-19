import React, { useState } from "react";
import Swal from "sweetalert2";

const ModalIgv = ({ isOpen, onClose, onSelectIgv }) => {
  const [selectedIgv, setSelectedIgv] = useState(null);

  const handleSelectIgv = (value) => {
    setSelectedIgv(value);
  };

  const handleSave = () => {
    if (selectedIgv) {
      onSelectIgv(selectedIgv);
      AlertGuardando();
    } else {
      // Opcional: mostrar un mensaje de error si no se ha seleccionado nada
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, seleccione un valor de IGV",
      });
    }
  };
  const AlertGuardando = () => {
    // ESTILOS DE PRECARGADO
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000,
      background: "transparent",
      backdrop: "none",
      html: `
        <div class="fixed inset-0 flex items-center justify-center z-[99]">
        <div class="loader2">
          <div class="form1">
            <div class="square"></div>
            <div class="square"></div>
          </div>
          <div class="form2">
            <div class="square"></div>
            <div class="square"></div>
          </div>
        </div>
      </div>
      `,

      onBeforeOpen: () => {
        // Función que se ejecuta antes de que se abra la ventana modal
        Swal.showLoading(); // Muestra una animación de carga dentro de la ventana modal
      },
    });
    onClose();
  };
  return (
    <>
      <div
        className={`fixed inset-0  bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed inset-0 z-50  flex items-center justify-center transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white  rounded-lg shadow-lg   w-[39%]  mx-4  transform transition-all duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6">
            <div className=" text-center  ">
              <h1 className="side-txt font-bold text-xl mb-4 text-gray-600">
                Actualizar tasa del IGV
              </h1>
            </div>
            <div>
              <div className="grid grid-cols-2 m gap-x-6 ">
                <button
                  onClick={() => handleSelectIgv("10")}
                  className={`focus:bg-blue-400 focus:border-blue-400 focus:text-white text-gray-500 border-4 px-2 shadow-md border-gray-500 rounded-xl ${
                    selectedIgv === "10" ? "bg-blue-400 text-white " : ""
                  }`}
                >
                  <p className="text-5xl   my-2 font-semibold">10%</p>
                  <div className="px-2 mb-4">
                    <p className="text-sm font-semibold">
                      {" "}
                      Tasa especial para MYPES que pertenezcan al rubro de:{" "}
                      <br />
                      restaurantes, hoteles, alojamientos turisticos, servicios
                      de catering y concesionairos de alimentos
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => handleSelectIgv("18")}
                  className={`focus:bg-blue-400 focus:border-blue-400 focus:text-white text-gray-500 border-4 px-2 shadow-md border-gray-500 rounded-xl ${
                    selectedIgv === "18" ? "bg-blue-400 text-white " : ""
                  }`}
                >
                  <div className=" h-full ">
                    <p className="text-5xl   my-2 font-semibold">18%</p>
                    <div className="px-2 mb-4">
                      <p className="text-sm font-semibold">
                        {" "}
                        Tasa general del IGV para otros rubros
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="w-full mt-4 items-center text-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-5 py-1 bg-gray-400 rounded-md text-white  hover:bg-gray-500"
                >
                  Cancelar{" "}
                </button>
                <button
                  onClick={handleSave}
                  className="px-[22px] py-1  bg-blue-400 rounded-md text-white hover:bg-blue-500"
                >
                  Guardar{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalIgv;
