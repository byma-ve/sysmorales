import React, { useState } from "react";
import Home from "../../../Layout/Home";
import DateComponent from "./Components/DateComponent";
import HeaderFac from "./Components/HeaderFac";
import Select from "react-select";
import Tabla from "./Components/tabla";
import { Link } from "react-router-dom";
import Buscador from "./modals/Buscador";
import { IconoDown, IconoCerrar } from "../../../Iconos/Iconos-NavBar";
import Swal from "sweetalert2";
import { pilares } from "../../../Data/data";
import DocuPDF from "../Crear Factura-Boleta/Factura/components/DocuPDF";
import { PDFViewer } from "@react-pdf/renderer";
import BuscadorServicio from "../Crear Factura-Boleta/Factura/modals/BuscadorServicio";

const options = [
  { value: "Guia Remitente", label: "Guia Remitente" },
  { value: "Guia Transportista", label: "Guia Transportista" },
];
const optionsDOC = [
  { value: "RUC", label: "RUC" },
  { value: "DNI", label: "DNI" },
  { value: "CARNET DE EXTRANJERIA", label: "CARNET DE EXTRANJERIA" },
  { value: "PASAPORTE", label: "PASAPORTE" },
  {
    value: "CEDULA DIPLOMACIA IDENTIDAD",
    label: "CEDULA DIPLOMACIA IDENTIDAD",
  },
];
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
const HomeCrearGuiaRemision = () => {
  const [filas, setFilas] = useState([{ id: 1 }]); //estado para agregar filas de Vehiculos
  const [conductores, setConductores] = useState([{ id: 1 }]); //estado para agregar conductores
  const [selectedTab, setSelectedTab] = useState("Factura");
  const [selectedTab2, setSelectedTab2] = useState("privado");
  const [openInfoAdicional, setOpenInfoAdicional] = useState(false);
  const [openInfoAdicional2, setOpenInfoAdicional2] = useState(false);
  const [isModalBuscador, setIsModalBuscador] = useState(false);
  const [isModalBuscadorServicio, setIsModalBuscadorServicio] = useState(false);
  const [openModaPDF, setOpenModalPDF] = useState(false);

  const handleOpenModal = () => {
    setOpenModalPDF(true);
  };
  const openModaBuscador = () => {
    setIsModalBuscador(true);
  };
  const closeModalBuscadorServicio = () => {
    setIsModalBuscadorServicio(false);
  };
  const openModaBuscadorServicio = () => {
    setIsModalBuscadorServicio(true);
  };
  const closeModalBuscador = () => {
    setIsModalBuscador(false);
  };

  const agregarFila = () => {
    if (filas.length < 3) {
      setFilas([...filas, { id: Date.now() }]);
    }
  };

  const eliminarFila = (id) => {
    setFilas(filas.filter((fila) => fila.id !== id));
  };

  const agregarConductor = () => {
    if (conductores.length < 3) {
      setConductores([...conductores, { id: Date.now() }]);
    }
  };

  const eliminarConductor = (id) => {
    setConductores(conductores.filter((conductor) => conductor.id !== id));
  };
  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "0px",
      height: "14px",
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

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const handleTabClickTipo = (tipo) => {
    setSelectedTab2(tipo);
  };

  const OpenModalInfo = () => {
    setOpenInfoAdicional(!openInfoAdicional);
  };
  const OpenModalInfo2 = () => {
    setOpenInfoAdicional2(!openInfoAdicional2);
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

  return (
    <Home
      children2={
        <>
          {" "}
          <Buscador isOpen={isModalBuscador} onClose={closeModalBuscador} />
          <BuscadorServicio
            isOpen={isModalBuscadorServicio}
            onClose={closeModalBuscadorServicio}
          />
          <div className=" ">
            <ul className="flex flex-wrap w-full justify-start text-lg font-medium text-gray-700 mb-4 lg:mb-0 pt-2">
              <li className=" bg-white text-blue-500 group transition-transform duration-300 p-2 px-4 rounded-t-xl">
                <Link
                  to=""
                  className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                >
                  Guias de Remision
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-white px-4 rounded-xl rounded-tl-none">
            <HeaderFac tipo="T" name="guia de remision" />
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-3 gap-x-10 ">
                <div className="1 space-y-3">
                  <div className="mb-2 w-full">
                    <Select
                      placeholder="Tipo de Guia de Remision"
                      styles={customStyles2}
                      options={options}
                    ></Select>
                  </div>
                  <div className="mb-2 w-full">
                    <Select
                      placeholder="Motivo de traslado"
                      styles={customStyles2}
                      options={optionsTraslado}
                    ></Select>
                  </div>

                  <div className="TIPODOCUMENTO flex w-full justify-between ">
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
                </div>
                <div className="2">
                  <div className="relative z-0 w-full mb-3 group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Direccion
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-x-10 mb-[14px]">
                    <div className="w-full group">
                      <Select
                        placeholder="Departamento"
                        styles={customStyles2}
                        options={options}
                      ></Select>
                    </div>
                    <div className="w-full  group ">
                      <Select
                        placeholder="Provincia"
                        styles={customStyles2}
                        options={options}
                      ></Select>
                    </div>
                  </div>
                  <div className="w-full group ">
                    <Select
                      placeholder="Distrito"
                      styles={customStyles2}
                      options={options}
                    ></Select>
                  </div>
                  <div className="relative z-0 w-full mt-[14px] group">
                    <input
                      type="text"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Email
                    </label>
                  </div>
                </div>
                <div className="3   ">
                  <div className="relative z-0  w-full mb-4  group ">
                    <DateComponent />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Fecha de Emision *
                    </label>
                  </div>
                  <div className="border  border-gray-400 rounded-xl p-6">
                    <h1 className="font-semibold text-md mb-3 border-b-2 pb-6 border-gray-400">
                      Documentos Relacionados:
                    </h1>
                    <div className="space-y-4 pt-4 items-center">
                      <div>
                        <div className=" items-center flex justify-between  space-x-2">
                          <button
                            onClick={openModaBuscador}
                            className="px-4 bg-gradient-to-t  py-2  from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md item text-white"
                          >
                            Añadir documento
                          </button>
                          <button
                            onClick={openModaBuscadorServicio}
                            className="px-4 bg-gradient-to-t  py-2  from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md item text-white"
                          >
                            Vincular O. Servicio
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="DATOSDEENVIO ">
                <div className="bg-blue-400 px-4 text-white w-32 text-sm py-2 rounded-t-lg">
                  Datos de envio
                </div>
                <div className="border-1 border border-blue-400 rounded-tl-none rounded-xl px-6 pb-2">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex gap-x-10 items-center py-4">
                      <h1 className="font-semibold uppercase">
                        Tipo de transporte
                      </h1>
                      <button
                        onClick={() => handleTabClickTipo("privado")}
                        className={`py-1 text-sm px-6 rounded-md text-white ${
                          selectedTab2 === "privado"
                            ? "bg-gradient-to-t  py-2 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br"
                            : "bg-gradient-to-t py-2  from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br"
                        }`}
                      >
                        Privado
                      </button>
                      <button
                        onClick={() => handleTabClickTipo("publico")}
                        className={`py-1 text-sm px-6 rounded-md text-white ${
                          selectedTab2 === "publico"
                            ? "bg-gradient-to-t  py-2 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br"
                            : "bg-gradient-to-t py-2  from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br"
                        }`}
                      >
                        Público
                      </button>
                    </div>

                    {selectedTab2 === "privado" && (
                      <>
                        <div className="flex my-4 gap-x-10 border-b pb-2 border-gray-400 px-2">
                          <div className="relative z-0  w-full mb-4 group ">
                            <DateComponent />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Fecha de inicio de traslado *
                            </label>
                          </div>
                          <div className="relative z-0 w-[160%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Descripcion del traslado
                            </label>
                          </div>
                          <div className="w-[80%]">
                            <Select
                              placeholder="Unid. del peso bruto*"
                              options={optionsDOC}
                              styles={customStyles2}
                            />
                          </div>
                          <div className="relative z-0 w-[60%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Peso bruto total *
                            </label>
                          </div>
                        </div>
                        <div className="px-2">
                          <div className="py-2">
                            {" "}
                            <input type="checkbox" />{" "}
                            <label
                              htmlFor=""
                              className="text-base font-semibold"
                            >
                              {" "}
                              Translado en vehiculos de categoria M1 o L
                            </label>
                          </div>
                          <div className="DATOSVEHICULO py-2 ">
                            <h2 className="font-semibold">
                              Datos del vehículo
                            </h2>
                            {filas.map((fila) => (
                              <div
                                key={fila.id}
                                className="FILADATOSVEHICULO p-4 flex items-center gap-x-10 relative"
                              >
                                <div className="relative z-0 w-full group">
                                  <input
                                    type="text"
                                    name={`placa_${fila.id}`}
                                    id={`placa_${fila.id}`}
                                    className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                  />
                                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                    Placa principal *
                                  </label>
                                </div>
                                <div className="relative w-full group">
                                  <Select
                                    placeholder="Entidad emisora de la autorización vehicular "
                                    styles={customStyles2}
                                    options={optionsTraslado}
                                    className=""
                                  />
                                </div>
                                <div className="relative z-0 w-full group">
                                  <input
                                    type="text"
                                    name={`autorizacion_${fila.id}`}
                                    id={`autorizacion_${fila.id}`}
                                    className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                  />
                                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                    N° de autorización vehicular (opcional)
                                  </label>
                                </div>
                                {filas.length > 1 && (
                                  <button
                                    onClick={() => eliminarFila(fila.id)}
                                    className="absolute right-0 top-6 text-red-500 hover:text-red-700"
                                  >
                                    <IconoCerrar />
                                  </button>
                                )}
                              </div>
                            ))}

                            {filas.length < 3 && (
                              <div>
                                <button
                                  onClick={agregarFila}
                                  className="bg-blue-400 py-2 text-white px-4 py-1 text-sm rounded-md hover:bg-blue-500"
                                >
                                  Agregar vehículo
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="DATOSCONDUCTOR py-2">
                            <h2 className="font-semibold">
                              Datos del conductor
                            </h2>
                            {conductores.map((conductor) => (
                              <div key={conductor.id} className="relative">
                                <div className="p-4 flex items-center gap-x-10">
                                  <div className="relative w-full group">
                                    <Select
                                      placeholder="Tipo de Documento"
                                      styles={customStyles2}
                                      options={optionsTraslado}
                                      className=""
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      Tipo de Documento
                                    </label>
                                  </div>
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`doc_identidad_${conductor.id}`}
                                      id={`doc_identidad_${conductor.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      N° Doc. de identidad*
                                    </label>
                                  </div>
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`licencia_${conductor.id}`}
                                      id={`licencia_${conductor.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      N° de licencia o brevete *
                                    </label>
                                  </div>
                                </div>
                                <div className="p-4 flex items-center gap-x-10">
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`nombre_${conductor.id}`}
                                      id={`nombre_${conductor.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      Nombre del conductor *
                                    </label>
                                  </div>
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`apellido_${conductor.id}`}
                                      id={`apellido_${conductor.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      Apellido del conductor *
                                    </label>
                                  </div>
                                  <div className="w-full"></div>
                                </div>
                                {conductores.length > 1 && (
                                  <button
                                    onClick={() =>
                                      eliminarConductor(conductor.id)
                                    }
                                    className="absolute right-0 top-6 text-red-500 hover:text-red-700"
                                  >
                                    <IconoCerrar />
                                  </button>
                                )}
                              </div>
                            ))}

                            {conductores.length < 3 && (
                              <div>
                                <button
                                  onClick={agregarConductor}
                                  className="bg-blue-400 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-500"
                                >
                                  Agregar conductor
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="DATOS ADICIONALES">
                            <button
                              onClick={OpenModalInfo}
                              className="font-semibold flex items-center text-blue-500  my-4 gap-x-2 "
                            >
                              Otros datos Adicionales <IconoDown />
                            </button>
                            <div
                              className={`transform origin-top transition-all  duration-300 ease-in-out overflow-hidden space-y-4 mx-4 py-2 ${
                                openInfoAdicional
                                  ? "scale-y-100 opacity-100 max-h-[1000px] "
                                  : "scale-y-0 opacity-0 max-h-0 "
                              }`}
                            >
                              <div>
                                Datos de la autorizacion especial para el
                                traslado de carga (opcional){" "}
                              </div>
                              <div className="flex gap-x-10 items-center ">
                                <div className="relative z-0 w-[50%]  group">
                                  <input
                                    type="text"
                                    name="contacto_area"
                                    id="contacto_area"
                                    className=" block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                  />
                                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                    N° de autorización vehícular (opcional)
                                  </label>
                                </div>
                                <div className="relative  w-full  group">
                                  <Select
                                    placeholder="Entidad emisora de la autorización vehícular(opcional)"
                                    styles={customStyles2}
                                    options={optionsTraslado}
                                    className="w-[50%]"
                                  ></Select>
                                </div>
                              </div>
                              <div>
                                {" "}
                                <h1 className="font-semibold text-gray-600">
                                  Indicadores:
                                </h1>
                              </div>
                              <div className="flex gap-x-10 justify-between text-gray-600 font-semibold">
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Indicador de retorno de vehiculo con envases
                                    o embajales vacios
                                  </label>
                                </div>
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Transbordo Programado
                                  </label>
                                </div>
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Indicador de retorno de vehiculo vacio
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedTab2 === "publico" && (
                      <>
                        <div className="flex my-4 gap-x-10 border-b pb-2 border-gray-400 px-2">
                          <div className="relative z-0  w-full mb-4 group ">
                            <DateComponent />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Fecha de entrega al Transportista *
                            </label>
                          </div>
                          <div className="relative z-0 w-[160%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Descripcion del traslado
                            </label>
                          </div>
                          <div className="w-[80%]">
                            <Select
                              placeholder="Unid. del peso bruto*"
                              options={optionsDOC}
                              styles={customStyles2}
                            />
                          </div>
                          <div className="relative z-0 w-[60%]  group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Peso bruto total *
                            </label>
                          </div>
                        </div>
                        <div className="px-2">
                          <div className="py-2">
                            {" "}
                            <input type="checkbox" />{" "}
                            <label
                              htmlFor=""
                              className="text-base font-semibold"
                            >
                              {" "}
                              Translado en vehiculos de categoria M1 o L
                            </label>
                          </div>
                          <div className="DATOSTRANSPORTISTA py-2 ">
                            <h2 className="font-semibold">
                              Datos del transportista
                            </h2>
                            {filas.map((fila) => (
                              <>
                                <div
                                  key={fila.id}
                                  className="FILADATOSVEHICULO p-4 flex items-center gap-x-10 relative"
                                >
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`placa_${fila.id}`}
                                      id={`placa_${fila.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      RUC *
                                    </label>
                                  </div>
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`autorizacion_${fila.id}`}
                                      id={`autorizacion_${fila.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      Razon social o denominacion *
                                    </label>
                                  </div>
                                  <div className="relative z-0 w-full group">
                                    <input
                                      type="text"
                                      name={`autorizacion_${fila.id}`}
                                      id={`autorizacion_${fila.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      N° de registro MTC
                                    </label>
                                  </div>
                                </div>
                                <div className="FILADATOSVEHICULO p-4 flex items-center gap-x-10 relative">
                                  <div className="relative z-0 w-1/3 group pr-6">
                                    <input
                                      type="text"
                                      name={`autorizacion_${fila.id}`}
                                      id={`autorizacion_${fila.id}`}
                                      className="block py-2 px-0 w-full text-sm bg-transparent border-0 border-b-[1px] appearance-none border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                      placeholder=" "
                                      required
                                    />
                                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                                      E-mail de Transportista
                                    </label>
                                  </div>{" "}
                                </div>
                                <div className="my-4 mx-4 text-gray-600">
                                  <div>
                                    <input type="checkbox" />
                                    <label htmlFor="" className="font-semibold">
                                      {" "}
                                      Registrar vehiculos y conductores del
                                      transporte
                                    </label>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>

                          <div className="DATOS ADICIONALES">
                            <button
                              onClick={OpenModalInfo2}
                              className="font-semibold flex items-center text-blue-500  my-4 gap-x-2 "
                            >
                              Otros datos Adicionales <IconoDown />
                            </button>
                            <div
                              className={`transform origin-top transition-all  duration-300 ease-in-out overflow-hidden space-y-4 mx-4 py-2 ${
                                openInfoAdicional2
                                  ? "scale-y-100 opacity-100 max-h-[1000px] "
                                  : "scale-y-0 opacity-0 max-h-0 "
                              }`}
                            >
                              <div>
                                {" "}
                                <h1 className="font-semibold text-gray-600">
                                  Indicadores:
                                </h1>
                              </div>
                              <div className="flex gap-x-10 justify-between text-gray-600 font-semibold">
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Indicador de retorno de vehiculo con envases
                                    o embajales vacios
                                  </label>
                                </div>
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Transbordo Programado
                                  </label>
                                </div>
                                <div>
                                  <input type="checkbox" />
                                  <label htmlFor="">
                                    {" "}
                                    Indicador de retorno de vehiculo vacio
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="PARTIDAYLLEGADA ">
                <ul className="flex flex-wrap w-full justify-start text-lg font-medium text-gray-700  lg:mb-0 ">
                  <li
                    className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                      selectedTab === "Factura"
                        ? "bg-blue-500 text-white"
                        : " bg-gray-200 text-blue-500"
                    }`}
                    onClick={() => handleTabClick("Factura")}
                  >
                    <Link
                      to=""
                      className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                    >
                      Punto de partida
                      <span
                        className={`absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform ${
                          selectedTab === "Factura"
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        } transition-transform duration-300`}
                      ></span>
                    </Link>
                  </li>
                  <li
                    className={`group transition-transform duration-300 p-2 px-4 rounded-t-xl ${
                      selectedTab === "Boleta"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-blue-500"
                    }`}
                    onClick={() => handleTabClick("Boleta")}
                  >
                    <Link
                      to=""
                      className="elmnts relative text-[15px] font-semibold no-underline transition-all overflow-hidden pb-1"
                    >
                      Punto de llegada
                      <span
                        className={`absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform ${
                          selectedTab === "Boleta"
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        } transition-transform duration-300`}
                      ></span>
                    </Link>
                  </li>
                </ul>
                {selectedTab === "Factura" && (
                  <>
                    <div className="space-y-6 border-1 border border-blue-400 rounded-tl-none rounded-xl px-6 py-4">
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
                          Direccion *
                        </label>
                      </div>
                      <div className="flex gap-x-10">
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Departametno"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Departametno
                          </label>
                        </div>
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Provincia"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Provincia
                          </label>
                        </div>
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Distrito"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Distrito
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedTab === "Boleta" && (
                  <>
                    {" "}
                    <div className="space-y-6 border-1 border border-blue-400 rounded-tl-none rounded-xl px-6 py-4">
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
                          Direccion *
                        </label>
                      </div>
                      <div className="flex gap-x-10">
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Departametno"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Departametno
                          </label>
                        </div>
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Provincia"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Provincia
                          </label>
                        </div>
                        <div className="relative  w-full  group">
                          <Select
                            placeholder="Distrito"
                            styles={customStyles2}
                            options={optionsTraslado}
                            className=""
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Distrito
                          </label>
                        </div>
                      </div>
                    </div>{" "}
                  </>
                )}
              </div>
              <div className="TABLA">
                <Tabla />
              </div>

              <div className="BOTONES  bg-white rounded-md">
                <div className="flex justify-between items-start mt-8">
                  <div className="flex gap-x-8">
                    <button className="px-4 bg-gradient-to-t  py-2  from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md item text-white">
                      Limpiar
                    </button>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="px-4 bg-gradient-to-t  py-2  from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md item text-white"
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
                              <DocuPDF pilares={pilares} />
                            </PDFViewer>
                          </div>
                          <div className="text-black w-full gap-x-10 mt-4  flex justify-center">
                            <button
                              onClick={() => setOpenModalPDF(false)}
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
                  )}
                </div>

                {/* Campos obligatorios */}
                <p className="text-right text-sm text-gray-500 mt-4">
                  Campos obligatorios (*)
                </p>
                <p className="text-right text-sm text-gray-500 mt-4">
                  El formato PDF de guías de remisión es horizontal (**)
                </p>
              </div>
            </div>
          </div>
        </>
      }
    ></Home>
  );
};

export default HomeCrearGuiaRemision;
