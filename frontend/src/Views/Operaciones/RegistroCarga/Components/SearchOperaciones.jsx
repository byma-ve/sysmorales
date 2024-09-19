import { useState } from "react";
import ModalImprimir from "../Modals/ModalImprimir";
import { IconoOneBox, IconoBoxes } from "../../../../Iconos/Iconos-NavBar";

export const SearchOperaciones = ({
  titlle,
  handleFormSubmit,
  opcionSeleccionado,
  opcionesBuscadas,
  handleFormSubmitMasivo,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Visibilidad del Modal VISTA DE ENCABEZADOS
  const [modalVisible1, setModalVisible1] = useState(false);
  // Visibilidad del Modal VISTA DE ENCABEZADOS
  // Funcionalidad VISTA DE ENCABEZADOS
  const mostrarModal1 = () => {
    handleCloseModal();
    setModalVisible1(true);
  };

  return (
    <>
      <ModalImprimir
        modalVisible1={modalVisible1}
        setModalVisible1={setModalVisible1}
      />

      <div className="-mt-[8px] pb-3 ">
        <div className="text-white flex justify-between bg-var(--gris) items-center  ">
          <h1 className="text-3xl font-semibold">{titlle}</h1>
          <div className="items-center flex ">
            <button
              className={`px-[10px]   p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl mr-3 ${
                !(opcionSeleccionado && opcionSeleccionado)
                  ? "cursor-not-allowed"
                  : ""
              }`}
              disabled={!opcionSeleccionado}
              onClick={handleFormSubmit}
            >
              <IconoOneBox />
            </button>
            <button
              disabled={opcionesBuscadas.length === 0}
              onClick={handleFormSubmitMasivo}
              className={`px-[10px]   p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl mr-3 ${
                opcionesBuscadas.length === 0 ? "cursor-not-allowed" : ""
              }`}
            >
              <IconoBoxes />
            </button>
            <button
              onClick={mostrarModal1}
              className="bg-gradient-to-t from-blue-400 h-10 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
              px-8 tracking-wide text-[18px] font-semibold  rounded-[10px]   ml-4  "
            >
              <h1>Imprimir</h1>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
