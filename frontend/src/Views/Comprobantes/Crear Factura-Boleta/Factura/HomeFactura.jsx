import React, { useState, useEffect, useRef, useContext } from "react";
import { IconoEditorLapiz } from "../../../../Iconos/Iconos-NavBar";
import DateComponent from "./components/DateComponent";
import Select from "react-select";
import HeaderFac from "./components/HeaderFac";
import ModalIgv from "./modals/ModalIgv";
import Tabla from "./components/tabla";
import Swal from "sweetalert2";
import Buscador from "./modals/Buscador";
import { PDFViewer } from "@react-pdf/renderer";
import DocuPDFFactura from "../Components/DocuPDFFactura";
import { ColorContext } from "../../../../Context/ColorProvider";
import { pilares } from "../../../../Data/data";
import BuscadorServicio from "./modals/BuscadorServicio";
const HomeFactura = () => {
  const { color } = useContext(ColorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [igvValue, setIgvValue] = useState("18.00");
  const [tipoFactura, setTipoFactura] = useState("nacional");
  const [isModalBuscador, setIsModalBuscador] = useState(false);
  const [isModalBuscadorServicio, setIsModalBuscadorServicio] = useState(false);
  const [openModaPDF, setOpenModalPDF] = useState(false);

  const handleOpenModal = () => {
    setOpenModalPDF(true);
  };

  const openModaBuscador = () => {
    setIsModalBuscador(true);
  };
  const openModaBuscadorServicio = () => {
    setIsModalBuscadorServicio(true);
  };
  const closeModalBuscador = () => {
    setIsModalBuscador(false);
  };
  const closeModalBuscadorServicio = () => {
    setIsModalBuscadorServicio(false);
  };

  const handleTipoFacturaChange = (e) => {
    setTipoFactura(e.target.value);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectIgv = (value) => {
    setIgvValue(value + ".00");
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
  return (
    <>
      <ModalIgv
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelectIgv={handleSelectIgv}
      />
      <Buscador isOpen={isModalBuscador} onClose={closeModalBuscador} />
      <BuscadorServicio
        isOpen={isModalBuscadorServicio}
        onClose={closeModalBuscadorServicio}
      />
      <div className="bg-white px-4   rounded-b-xl">
        <HeaderFac name="FACTURA" tipo="F" />
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
                name="tipoFactura"
                value="internacional"
                className="mr-2"
                checked={tipoFactura === "internacional"}
                onChange={handleTipoFacturaChange}
              />
              <label htmlFor="internacional">Internacional</label>
            </div>
            <div className="grid grid-cols-3 gap-x-10 ">
              {tipoFactura === "nacional" && (
                <div className="1 space-y-4 ">
                  <div className=" w-full">
                    <Select
                      placeholder="Venta Interna"
                      styles={customStyles2}
                      options={options}
                    ></Select>
                  </div>
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
                        type="text"
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
                    <div className="w-full group mb-2">
                      <Select
                        placeholder="Departamento"
                        styles={customStyles2}
                        options={options}
                      ></Select>
                    </div>
                    <div className="w-full  group mb-2">
                      <Select
                        placeholder="Provincia"
                        styles={customStyles2}
                        options={options}
                      ></Select>
                    </div>
                  </div>
                  <div className="w-full  group ">
                    <Select
                      placeholder="Distrito"
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
                      Email
                    </label>
                  </div>
                </div>
              )}
              {tipoFactura === "internacional" && (
                <div className="1 space-y-4">
                  <div className=" w-full">
                    <Select
                      placeholder="Exportación de Bienes (0200)"
                      styles={customStyles2}
                      options={options}
                    ></Select>
                  </div>
                  <div className="flex w-full justify-between  ">
                    <div className="w-full pr-10  ">
                      <Select
                        placeholder="N° ID Tributario"
                        styles={customStyles2}
                        options={optionsDOC}
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
                <div className="relative z-0 w-full group">
                  <input
                    type="date"
                    name="contacto_area"
                    id="contacto_area"
                    className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                    Fecha de Vencimiento *
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
                  </div>

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
                        type="number"
                        name="contacto_area"
                        id="contacto_area"
                        className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
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
                <div className="flex gap-x-10">
                  <div className="relative z-0 w-full group">
                    <select
                      id="moneda"
                      name="moneda"
                      className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 ps-1  focus:border-blue-600 peer "
                    >
                      <option className="text-gray-900 bg-white hover:bg-gray-100">
                        CONTADO
                      </option>
                      <option className="text-gray-900 bg-white hover:bg-gray-100">
                        CREDITO
                      </option>
                    </select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Tipo de Pago
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
                      Nro. Cuotas
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="items-end"></div>
                  <div className="items-end">
                    <button
                      onClick={openModaBuscadorServicio}
                      className="px-4 bg-gradient-to-t py-2    from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md  item text-white "
                    >
                      Vincular O. Servicio
                    </button>
                  </div>
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
                      Referencias a proyectos
                    </label>
                  </div>
                  <div></div>
                  <div className="space-y-4 pt-4">
                    <div>
                      <div className="flex items-center justify-between space-x-2">
                        <label
                          htmlFor="file-upload"
                          className=" font-semibold "
                        >
                          Guias de remision:
                        </label>
                        <button
                          onClick={openModaBuscador}
                          className="px-4 bg-gradient-to-t py-2    from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md  item text-white "
                        >
                          Agregar guia
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="TABLA">
            <Tabla />
          </div>

          <div className="grid grid-cols-[1fr,1.5fr,1fr]">
            <div className="space-y-6  mt-6">
              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  id="descuentoGlobal"
                  className="w-4 h-4"
                />
                <label htmlFor="descuentoGlobal" className="text-gray-700">
                  Descuento Global
                </label>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  id="descuentoGlobal"
                  className="w-4 h-4"
                />
                <label htmlFor="retencion" className="text-gray-700">
                  Retención:
                </label>
                <select id="retencion" className="border-gray-300 rounded-md">
                  {/* Opciones del select */}
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <input type="checkbox" id="detraccion" className="w-4 h-4" />
                <label htmlFor="detraccion" className="text-gray-700">
                  Detracción:
                </label>
                <select id="detraccion" className="border-gray-300 rounded-md">
                  {/* Opciones del select */}
                </select>
              </div>
            </div>
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
                  <label className="text-gray-700">Operación Exportación</label>
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
                          <DocuPDFFactura pilares={pilares} color={color} />
                        </PDFViewer>
                      </div>
                      <div className="text-black w-full gap-x-10  mt-4 flex justify-center">
                        <button
                          onClick={() => setOpenModalPDF(false)}
                          className="px-6 py-2 text-white bg-gradient-to-t   from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md "
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
    </>
  );
};

export default HomeFactura;
