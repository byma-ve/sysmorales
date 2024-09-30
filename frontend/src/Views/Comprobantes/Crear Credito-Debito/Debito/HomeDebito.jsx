import React, { useState, useContext } from "react";
import { IconoEditorLapiz } from "../../../../Iconos/Iconos-NavBar";
import Select from "react-select";
import HeaderFac from "./Components/HeaderFac";
import DateComponent from "./Components/DateComponent";
import Buscador from "./modals/Buscador";
import ModalIgv from "./modals/ModalIgv";
import Tabla from "./Components/Tabla";
import Swal from "sweetalert2";
import DocuPDFNotaDebito from "../Components/DocuPDFNotaDebito";
import { ColorContext } from "../../../../Context/ColorProvider";
import { pilares } from "../../../../Data/data";
import { PDFViewer } from "@react-pdf/renderer";

const optionsTraslado = [
  { value: "RUC", label: "RUC" },
  { value: "DNI", label: "DNI" },
  { value: "CARNET DE EXTRANJERIA", label: "CARNET DE EXTRANJERIA" },
  { value: "PASAPORTE", label: "PASAPORTE" },
  {
    value: "CEDULA DIPLOMACIA IDENTIDAD",
    label: "CEDULA DIPLOMACIA IDENTIDAD",
  },
];
const HomeDebito = () => {
  const { color } = useContext(ColorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBuscador, setIsModalBuscador] = useState(false);
  const [documentType, setDocumentType] = useState("Factura");
  const [igvValue, setIgvValue] = useState("18.00");
  const [tipoFactura, setTipoFactura] = useState("nacional");
  const [openModaPDF, setOpenModalPDF] = useState(false);

  const handleOpenModal = () => {
    setOpenModalPDF(true);
  };
  const handleTipoFacturaChange = (e) => {
    setTipoFactura(e.target.value);
  };
  const handleSelectIgv = (value) => {
    setIgvValue(value + ".00");
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModaBuscador = () => {
    setIsModalBuscador(true);
  };
  const closeModalBuscador = () => {
    setIsModalBuscador(false);
  };
  const handleEmitirClick = () => {
    setOpenModalPDF(false);
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
  const options = [
    { value: "Venta Interna (0101)", label: "Venta Interna (0101)" },
    { value: "CREDITO", label: "CREDITO" },
  ];
  const optionsDOC = [
    { value: "RUC", label: "RUC" },
    { value: "DNI", label: "DNI" },
  ];
  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "5px",
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
  return (
    <>
      {" "}
      <ModalIgv
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelectIgv={handleSelectIgv}
      />
      <Buscador isOpen={isModalBuscador} onClose={closeModalBuscador} />
      <div className="bg-white px-4  rounded-xl rounded-tl-none">
        <HeaderFac
          name="Nota de Débito"
          tipo={documentType === "Factura" ? "F" : "B"}
        />
        <div className="mt-8">
          <div className="">
            <div className=" px-4 rounded-xl">
              <div className="  border border-gray-600 rounded-lg  py-2 mx-4 ">
                <div className="flex justify-start  gap-x-8 w-full px-6 py-2 items-center rounded-t-lg text-black">
                  <h1 className="font-semibold  whitespace-nowrap">
                    Tipo de comprobante:
                  </h1>
                  <div className="flex ">
                    <div className="flex ">
                      <input
                        type="radio"
                        id="nacional2"
                        value="Factura"
                        name="tipoFactura2"
                        className="mr-2"
                        onClick={() => setDocumentType("Factura")}
                      />
                      <label htmlFor="nacional" className="mr-4">
                        Factura
                      </label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        id="internacional2"
                        value="Boleta"
                        name="tipoFactura2"
                        className="mr-2"
                        onClick={() => setDocumentType("Boleta")}
                      />
                      <label htmlFor="internacional">Boleta</label>
                    </div>
                  </div>
                  <button
                    onClick={openModaBuscador}
                    className="px-8 bg-gradient-to-t  py-2 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md item text-white "
                  >
                    Buscar
                  </button>{" "}
                </div>
                <div className="flex px-6  gap-x-10 my-4">
                  <div className="relative z-0 w-full  group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Comprobante de referencia *
                    </label>
                  </div>
                  <div className="relative z-0 w-full  group">
                    <input
                      type="date"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Fecha de referencia
                    </label>
                  </div>
                  <div className="relative z-0 w-full  group">
                    <Select
                      placeholder="Tipo de operacion"
                      styles={customStyles2}
                      options={optionsTraslado}
                      className=""
                    ></Select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Tipo de operacion
                    </label>
                  </div>
                </div>
                <div className="flex justify-between  gap-x-8 w-full px-6 py-2 items-center rounded-t-lg text-black">
                  <textarea
                    placeholder="Añadir observaciones *"
                    className=" w-full px-2 py-2 min-h-11 outline-none rounded-md h-full max-h-[100px] border border-gray-400 "
                    name=""
                    id=""
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className=" rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Tipo de factura:</h2>

            <div className="flex just mb-4">
              <input
                type="radio"
                id="nacional"
                name="tipoFactura"
                value="nacional"
                className="mr-2"
                checked={tipoFactura === "nacional"}
                onChange={handleTipoFacturaChange}
              />
              <label htmlFor="nacional" className="mr-4">
                Nacional
              </label>
              <input
                type="radio"
                id="internacional"
                value="internacional"
                name="tipoFactura"
                className="mr-2"
                checked={tipoFactura === "internacional"}
                onChange={handleTipoFacturaChange}
              />
              <label htmlFor="internacional">Internacional</label>
            </div>
            <div className="grid grid-cols-3 gap-x-10 ">
              {tipoFactura === "nacional" && (
                <div className="1 space-y-4 ">
                  <div className="flex w-full justify-between ">
                    <div className="w-full pr-10  ">
                      <Select
                        placeholder="Tipo Doc."
                        styles={customStyles2}
                        options={optionsDOC}
                      ></Select>
                    </div>
                    <div className="relative z-0 w-full  group">
                      <input
                        type="number"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Nro Documento *
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Razon Social *
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Direccion
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-10 ">
                    <div className="relative  w-full group">
                      <Select
                        placeholder="Departamento"
                        styles={customStyles2}
                        options={optionsDOC}
                      ></Select>
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Departamento
                      </label>
                    </div>
                    <div className="relative  w-full group">
                      <Select
                        placeholder="Provincia"
                        styles={customStyles2}
                        options={optionsDOC}
                      ></Select>
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Provincia
                      </label>
                    </div>
                  </div>
                  <div className="relative  w-full group">
                    <Select
                      placeholder="Distrito"
                      styles={customStyles2}
                      options={optionsDOC}
                    ></Select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Distrito
                    </label>
                  </div>
                  <div className="relative z-0 w-full  group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Email
                    </label>
                  </div>
                </div>
              )}
              {tipoFactura === "internacional" && (
                <div className="1 space-y-4">
                  <div className="flex w-full justify-between  ">
                    <div className="w-full pr-10  ">
                      <div className="relative z-0 w-full group">
                        <input
                          type="text"
                          name="contacto_area"
                          id="contacto_area"
                          className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                          N° ID Tributario
                        </label>
                      </div>
                    </div>

                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Razon Social *
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="relative z-0 w-full group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Direccion
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-10 ">
                    <div className="w-full group mb-2">
                      <Select
                        placeholder="Pais"
                        styles={customStyles2}
                        options={options}
                      ></Select>
                    </div>
                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        Codigo Postal
                      </label>
                    </div>
                  </div>
                  <div className="relative z-0 w-full  group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Ciudad
                    </label>
                  </div>
                  <div className="relative z-0 w-full  group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Email
                    </label>
                  </div>
                </div>
              )}
              <div className="2 space-y-4 ">
                <div className="relative z-0 w-full group">
                  <DateComponent />

                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                    Fecha de Emision *
                  </label>
                </div>

                <div className="flex gap-x-10">
                  <div className="relative z-0 w-full group">
                    {/* <Select
                              styles={customStyles}
                              className="block py-[5px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            ></Select> */}
                    <select
                      id="moneda"
                      name="moneda"
                      className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 ps-1 focus:border-blue-600 peer"
                    >
                      <option>Soles</option>
                      <option>Dólares</option>
                      <option>Euros</option>
                    </select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Moneda
                    </label>
                  </div>{" "}
                  {tipoFactura === "nacional" && (
                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        value={igvValue}
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        IGV % *
                      </label>{" "}
                      <button
                        onClick={openModal}
                        className="absolute top-3 right-1 text-xl hover:text-blue-400 text-gray-500"
                      >
                        <IconoEditorLapiz />
                      </button>
                    </div>
                  )}
                  {tipoFactura === "internacional" && (
                    <div className="relative z-0 w-full  group">
                      <input
                        type="text"
                        name="contacto_area"
                        id="contacto_area"
                        value="00.00"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        readOnly
                      />
                      <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                        IGV % *
                      </label>{" "}
                      {/* <button
                        onClick={openModal}
                        className="absolute top-3 right-1 text-xl hover:text-blue-400 text-gray-500"
                      >
                        <IconoEditorLapiz />
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
              <div className="3 border border-1 border-gray-400 rounded-xl p-4">
                <h1 className="font-semibold text-md mb-3">
                  Documentos de referencia
                </h1>
                <div className="mx-2 space-y-4">
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Condicion de pago
                    </label>
                  </div>
                  <div className="relative z-0 w-full group ">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Orden de Compra
                    </label>
                  </div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Centro de costos
                    </label>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <span>Adjuntar archivos</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 ml-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.172 7l-6.414 6.414a2 2 0 102.828 2.828l6.414-6.414a4 4 0 10-5.656-5.656L7 7.757M7 13v3.586a2 2 0 01-.586 1.414L4 20h16"
                            />
                          </svg>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" TABLA ">
              <Tabla />
            </div>
            <div className="grid grid-cols-[1fr,1.5fr,1fr]">
              <div className="space-y-6  mt-6"></div>
              <div></div>
              <div className="grid grid-cols-1 gap-10 mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Operación Gravada</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Operación Inafecta</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Operación Exonerada</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">
                      Operación Exportación
                    </label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Descuentos Totales</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Anticipos</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">
                      Total de Op. Gratuitas
                    </label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">Subtotal</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">ICBPER</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">ISC Total</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700">IGV Total</label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 font-semibold">
                      PRECIO TOTAL
                    </label>
                    <input
                      type="text"
                      value="0.00"
                      className="border-gray-400 border rounded px-1 text-right w-32 font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="BOTONES  bg-white rounded-md">
              <div className="flex justify-between items-start mt-8">
                <div className="grid gap-y-4">
                  <button className="px-6 py-2 text-white bg-gradient-to-t   from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md">
                    Limpiar
                  </button>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br text-white py-2 px-8 rounded-md"
                >
                  Previsualizar
                </button>
                {openModaPDF && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                    <div className=" rounded-lg bg-[#525659] shadow-xl w-11/12 max-w-4xl">
                      <div className="flex items-center justify-between px-4   text-black"></div>
                      <div className="pb-4">
                        <div className="w-full h-[550px] relative">
                          <PDFViewer
                            style={{
                              width: "100%",
                              height: "550px",
                            }}
                          >
                            <DocuPDFNotaDebito
                              pilares={pilares}
                              color={color}
                            />
                          </PDFViewer>
                        </div>
                        <div className="text-black w-full gap-x-10 mt-4  flex justify-center">
                          <button
                            onClick={() => setOpenModalPDF(false)}
                            className="px-6 py-2 text-white bg-gradient-to-t   from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleEmitirClick}
                            className="px-6 py-2 text-white bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md"
                          >
                            Emitir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-right text-sm text-gray-500 mt-4">
                Campos obligatorios (*)
              </p>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default HomeDebito;
