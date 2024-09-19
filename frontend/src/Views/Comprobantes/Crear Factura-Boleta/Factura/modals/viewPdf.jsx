import React from "react";
import Swal from "sweetalert2";

const ViewPdf = ({ isOpen, onClose, dataPdf }) => {
  const handleEmitirClick = () => {
    onClose();
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      backdrop: "none",
      background: "transparent",
      timer: 1500,
      html: `
      <div class="flex justify-center items-center h-64">
        <div class="loader2">
          <div class="form1">
            <div class="square  "></div>
            <div class="square  "></div>
          </div>
          <div class="form2">
            <div class="square  "></div>
            <div class="square  "></div>
          </div>
        </div>
      </div>
    `,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl">
        <div className="flex items-center justify-between px-4 py-1 border-b text-black"></div>
        <div className="p-4">
          <div className="w-full h-[550px]">
            {dataPdf?.archivoBase64 ? (
              <object
                data={`data:application/pdf;base64,${dataPdf.archivoBase64}`}
                type="application/pdf"
                className="w-full h-full"
              >
                <p className="text-center">
                  Your browser cannot display this PDF.
                  <a
                    href={`data:application/pdf;base64,${dataPdf.archivoBase64}`}
                    download
                    className="text-blue-600 hover:underline"
                  >
                    Download it here
                  </a>
                  .
                </p>
              </object>
            ) : (
              <p className="text-center">No PDF data available.</p>
            )}
          </div>
          <div className="text-black w-full gap-x-10 mt-4  flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-1 text-white  bg-gradient-to-t   from-red-400 via-red-500 to-red-500 hover:bg-gradient-to-br  rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleEmitirClick}
              className="px-6 py-1 text-white bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md"
            >
              Emitir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPdf;
