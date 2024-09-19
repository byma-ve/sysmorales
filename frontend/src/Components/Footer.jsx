import React, { useEffect, useState } from "react";
import { imageData } from "../Data/Image";
import Fondo1 from "../Static/Img_Pred/Fondo3.webp";

function Footer({ onSelectImage, onCancel }) {
  // Abertura y cierre del Modal (boolean)
  const [modal, setModal] = useState(false);
  // State para manejar el movimiento del modal
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ left: 0, top: 0 });
  // Cambiar el fondo de pantalla de la Imagen seleccionada
  const [selectedImage, setSelectedImage] = useState(Fondo1);
  // Hacer focus en la imagen seleccionada
  const [focusedImage, setFocusedImage] = useState(Fondo1);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setFocusedImage(image);
  };

  const handleSave = () => {
    onSelectImage(selectedImage);
    onCancel();
    setModal(false);
  };

  const handleCancel = () => {
    // onCancel();
    setModal(false);
  };

  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setModalPosition({
        left: modalPosition.left + deltaX,
        top: modalPosition.top + deltaY,
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (modal && isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [modal, isDragging, modalPosition, dragStart]);

  return (
    <>
      <div className="footer flex">
        <div className="contenido flex">
          <p className="txt text-white">©2019 - BymaVe Innovation</p>
          <p
            onClick={() => setModal(true)}
            className="temas text-white ml-4 pl-4 border-l-2 border-white cursor-pointer"
          >
            Temas
          </p>
        </div>
      </div>

      {/* Modal de las Imagenes de Fondo */}
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          modal ? "flex" : "hidden"
        } overflow-y-hidden overflow-x-hidden absolute ml-[26%]     mt-0 justify-center items-center w-[50%] md:inset-0 max-h-full z-[99999999999999999999999]`}
        style={{
          left: `${modalPosition.left}px`,
          top: `${modalPosition.top}px`,
        }}
      >
        <div className="relative w-full max-h-full">
          <div className="relative w-full h-full rounded-lg shadow bg-sky-50">
            <div
              className="modal-header   h-[49px] flex items-center justify-between px-4 rounded-t"
              onMouseDown={handleMouseDown}
              style={{ cursor: "move" }}
            >
              <h3 className="text-[14px] font-semibold text-[#80868e]">
                Temas Visuales
              </h3>
              <button
                onClick={() => setModal(false)}
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex  justify-center items-center hover:bg-gray-600 hover:text-white"
                data-modal-hide="default-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only ">Close modal</span>
              </button>
            </div>
            <div className="cont-imagenes overflow-y-hidden max-h-[372px]">
              <div className="imagenes p-4 md:p-5">
                <div className="img h-full w-full flex flex-wrap bg-[#dedede]">
                  {imageData.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageClick(image)}
                      className={`imagen relative flex-[1] min-w-[25%] max-w-[25%] min-h-[140px] cursor-pointer box-border rounded-[15px] bg-[#dedede] bg-cover w-full h-full p-[5px] border-[#dedede] border-[5px] ${
                        focusedImage === image ? "focused" : ""
                      }`}
                      style={{ backgroundImage: `url(${image})` }}
                    >
                      {image === Fondo1 && (
                        <div className="txt-fondo1 absolute top-0 right-0 p-[0_10px] leading-[25px] h-[25px] bg-[rgba(29,181,229,.5)] text-white text-[12px] rounded-[15px]">
                          Por Defecto
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center p-4 md:p-5 rounded-b justify-center max-h-[69px]">
              <button
                data-modal-hide="default-modal"
                type="button"
                onClick={handleSave}
                className="text-white text-[12px] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              >
                Guardar
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                onClick={handleCancel}
                className="ms-3 text-[12px] focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
