import React, { useState, useEffect } from "react";
import ViewPdf from "./viewPdf";
import documentService from "./documentService";

const CardPdf = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const responseDataPdf = documentService();
      setPdfData(responseDataPdf);
      setLoading(false);
    }, 3000);
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="flex justify-center items-center   ">
      <ViewPdf
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataPdf={pdfData}
      />

      <div className=" shadow-md rounded-lg  ">
        <div className="flex justify-center items-center">
          <button onClick={toggleModal} className=" text-white rounded-md">
            Previsualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPdf;
