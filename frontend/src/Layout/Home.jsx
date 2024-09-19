import { useState, useEffect } from "react";

import Fondo from "../Static/Img_Pred/Fondo3.webp";

import Encabezado from "../Components/Encabezado";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

function Home({ children1, children2 }) {
  const storedImage = localStorage.getItem("selectedImage");
  const [selectedImage, setSelectedImage] = useState(storedImage || Fondo);
  const [pendingImage, setPendingImage] = useState(null);
  // Estados para mostrar el fondo del menu
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  // Cambio de estado cuando entra el mouse al menu lateral
  const handleMenuHover = () => {
    setIsMenuHovered(true);
  };

  // Cambio de estado cuando sale el mouse del menu lateral
  const handleMenuLeave = () => {
    setIsMenuHovered(false);
  };

  // Cambio de Imagen
  const changeBackgroundImage = (image) => {
    setPendingImage(image);
    setSelectedImage(image);
  };

  // Cancelar el fondo de Imagen
  const cancelImageSelection = () => {
    const storedImage = localStorage.getItem("selectedImage");
    setSelectedImage(storedImage);
  };

  // Renderizacion de la imagen al cambiar la imagend de fondo
  useEffect(() => {
    if (pendingImage !== null) {
      setSelectedImage(pendingImage);
      setPendingImage(null);
      localStorage.setItem("selectedImage", pendingImage);
    }
  }, [pendingImage]);

  // Control de la impresion
  const handlePrint = () => {
    const printContent = document.getElementById("tablas");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <div
        className="main relative min-h-screen bg-cover bg-no-repeat bg-scroll bg-center"
        style={{
          backgroundImage: `url(${selectedImage})`,
          transition: "all 1.0s",
        }}
      >
        <div
          className={`fondo-menu-lateral absolute w-[255px] h-[100vh] bg-black z-10 transition-all duration-[0.5s] ${
            isMenuHovered ? "block" : "hidden"
          }`}
          style={{
            opacity: isMenuHovered ? 0.7 : 0,
          }}
        ></div>
        <table className="table relative w-full h-[100vh] border-spacing-0 transition-all">
          <tbody className="tbody relative h-full w-full border-spacing-0">
            <tr className="cont-encabezado relative w-full ">
              <td className="encabezado h-0 p-0 align-top pt-2">
                <Encabezado />
              </td>
            </tr>
            <tr className="cont-cuerpo">
              <td className="cuerpo h-full p-0 align-top">
                <table className="cont-contenido w-full h-full">
                  <tbody className="contenido ">
                    <tr className="cont-tablas  ">
                      <td className="cont-navbar relative w-[65px] h-full flex flex-col top-5">
                        <Navbar
                          handleMenuHover={handleMenuHover}
                          handleMenuLeave={handleMenuLeave}
                        />
                      </td>
                      <td className="cont-tablas h-full w-full p-[1.5rem_0_0_1.5rem] overflow-auto">
                        <div className="tabla overflow-x-hidden  w-[97%] h-full flex flex-col">
                          <div className="cont-children1 no-imprimir w-full mt-4">
                            {children1}
                          </div>
                          <div
                            id="tablas"
                            className="cont-children2 w-full overflow-y-scroll ScrollTable"
                          >
                            {children2}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="cont-footer">
                      <td className="vacio w-60 h-0 p-0 align-top"></td>
                      <td className="footer pt-3 pb-4 px-14 h-0  align-top">
                        <Footer
                          onSelectImage={changeBackgroundImage}
                          onCancel={cancelImageSelection}
                          onPrint={handlePrint}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
