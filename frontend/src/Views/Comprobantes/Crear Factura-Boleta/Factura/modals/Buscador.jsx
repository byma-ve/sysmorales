import React, { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import Loaders from "../../../../../Components/Loaders";
import Pagination from "../components/PaginacionBuscador";
const guiaRemisionData = [
  {
    client: "DANFER VICTOR PALIZA MAGA",
    number: "B001-00000036",
    date: "2024-06-19",
    amount: 118.92,
  },
  {
    client: "YEREMI VICTOR PALIZA MAGA",
    number: "B001-00000035",
    date: "2024-06-03",
    amount: 170.0,
  },
  {
    client: "ERIKA CATHERINE MAGALLANE",
    number: "B001-00000034",
    date: "2024-05-17",
    amount: 59.0,
  },
];

const guiaTransportistaData = [
  {
    client: "ANGEL VICTOR PALIZA MAGA",
    number: "B001-00000036",
    date: "2024-06-19",
    amount: 118.92,
  },
  {
    client: "YEREMI VICTOR PALIZA MAGA",
    number: "B001-00000035",
    date: "2024-06-03",
    amount: 170.0,
  },
  {
    client: "ERIKA CATHERINE MAGALLANE",
    number: "B001-00000034",
    date: "2024-05-17",
    amount: 59.0,
  },
];

const options = [
  { value: "Todos", label: "Todos" },
  { value: "Guias remision", label: "Guias remision" },
  { value: "Guia transportista", label: "Guia transportista" },
];
const Buscador = ({ isOpen, onClose, onSelectIgv }) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChangingSelection, setIsChangingSelection] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsInitialLoading(true);
      // Simulamos una carga de datos
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 1500); // Ajusta este tiempo según lo que necesites
    }
  }, [isOpen]);
  const handleOptionChange = (selected) => {
    setIsChangingSelection(true);
    setSelectedOption(selected);
    // Simulate data loading
    setTimeout(() => {
      setIsChangingSelection(false);
    }, 1000); // Adjust this time as needed
  };

  const handleButtonClick = () => {
    onClose(); // Cierra el modal
    setIsLoading(true); // Muestra el componente Loaders

    // Muestra el Sweet Alert sin contenido visual propio
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      timer: 1000,
      background: "transparent",
      backdrop: "none", // Esto elimina el fondo oscuro de Sweet Alert
      showClass: {
        popup: "swal2-noanimation",
        backdrop: "swal2-noanimation",
      },
      hideClass: {
        popup: "",
        backdrop: "",
      },
    }).then(() => {
      setIsLoading(false); // Oculta el loader después de que se cierre el Sweet Alert
    });
  };

  const getTableData = () => {
    switch (selectedOption.value) {
      case "Guias remision":
        return guiaRemisionData;
      case "Guia transportista":
        return guiaTransportistaData;
      default:
        return [...guiaRemisionData, ...guiaTransportistaData];
    }
  };

  const renderTableContent = () => {
    if (isInitialLoading || isChangingSelection) {
      return (
        <tr>
          <td colSpan="4" className="text-center py-4">
            <div className="flex justify-center items-center">
              <div className="loader2">
                <div className="form1">
                  <div className="square !w-6 !h-6 "></div>
                  <div className="square !w-6 !h-6 "></div>
                </div>
                <div className="form2">
                  <div className="square !w-6 !h-6 "></div>
                  <div className="square !w-6 !h-6 "></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    } else {
      const data = getTableData();
      return data.map((item, index) => (
        <tr
          onClick={handleButtonClick}
          key={index}
          className="border-t cursor-pointer hover:bg-gray-100"
        >
          <td className="py-2">
            {item.client || item.destinatario || item.remitente}
          </td>
          <td className="py-2">{item.number || item.numero}</td>
          <td className="py-2">
            {item.date || item.fechaEmision || item.fechaInicioTraslado}
          </td>
          <td className="py-2">
            {item.amount
              ? `S/. ${item.amount.toFixed(2)}`
              : item.puntoPartida || item.vehiculo}
          </td>
        </tr>
      ));
    }
  };

  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "0px",
      height: "16px",
      borderBottom: "1px solid #9ca3af",
      boxShadow: "none",
      "&:active": {
        borderColor: "#0389fb ",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "10px 0",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "45px",
    }),

    menu: (provided) => ({
      ...provided,
      marginTop: "5px",
      borderRadius: "4px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      borderRadius: "5px",
    }),
  };

  const mostrarPrecargadoInicial = () => {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader2">
          <div className="form1">
            <div className="square !w-6 !h-6 "></div>
            <div className="square !w-6 !h-6 "></div>
          </div>
          <div className="form2">
            <div className="square !w-6 !h-6 "></div>
            <div className="square !w-6 !h-6 "></div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Loaders isVisible={isLoading} />
      <div
        className={`fixed inset-0  bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed inset-0 z-50  flex items-center justify-center transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white  rounded-lg shadow-lg   w-[45%]  mx-4  transform transition-all duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6 text-sm">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-500">
                  Buscar comprobante de referencia
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  X
                </button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="w-full ">
                    <Select
                      defaultValue={options[0]}
                      onChange={handleOptionChange}
                      styles={customStyles2}
                      options={options}
                    ></Select>
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="N° de Comprobante"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full p-2 border-b border-gray-400  outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="F. de emisión"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full p-2 border-b border-gray-400  outline-none"
                  />
                </div>
                <button className="px-4 bg-gradient-to-t  py-2  from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md item text-white ">
                  Buscar
                </button>
              </div>
              {isInitialLoading ? (
                mostrarPrecargadoInicial()
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2">Cliente</th>
                      <th className="py-2">N° Comprobante</th>
                      <th className="py-2">F. de Emisión</th>
                      <th className="py-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableContent()}</tbody>
                </table>
              )}
              <Pagination></Pagination>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buscador;
