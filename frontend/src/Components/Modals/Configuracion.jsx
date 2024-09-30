import React, { useRef, useContext, useState } from "react";
import Select from "react-select";
import { IconoCheck } from "../../Iconos/Iconos-NavBar";
import LogoBlanco from "../../Static/Img_Pred/LogoBlanco.webp";
import LogoOscuro from "../../Static/Img_Pred/LogoOscuro.webp";
import { BlockPicker } from "react-color";

import { ColorContext } from "../../Context/ColorProvider";

const options = [
  { value: "RUC", label: "RUC" },
  { value: "DNI", label: "DNI" },
];

const Configuracion = ({ modalConfiguracion, setModalConfiguracion }) => {
  const { setColor } = useContext(ColorContext); // Obtiene la función para actualizar el color global
  const [localColor, setLocalColor] = useState("#60a5fa"); // Estado local para manejar cambios antes de guardarlos
  const handleColorChange = (color) => {
    setLocalColor(color.hex); // Actualiza el color localmente antes de guardar
  };

  const handleSaveColor = () => {
    setColor(localColor); // Guarda el color al contexto
    setModalConfiguracion(false);
  };
  const CerraModal = () => {
    setModalConfiguracion(false);
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
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the click on the hidden input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Aquí puedes manejar el archivo seleccionado, por ejemplo, mostrar una vista previa
      console.log("Archivo seleccionado:", file);
    }
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalConfiguracion ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-[11]`}
      >
        <div
          className={`side-panel-cont-container ${
            modalConfiguracion ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[1000px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 z-[12]`}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 p-0 ">
            <div className="side-panel-iframe relative w-full h-full">
              <div className="side-panel  p-[0_15px_21px_21px] h-full w-auto m-0 overflow-y-auto  ScrollTableVertical ">
                <div className="side-cont-titulo p-[12px_0] text-[25px] font-medium text-slate-900 opacity-80"></div>
                <div className="grid grid-cols-[1fr,3fr] gap-x-4">
                  <div className="space-y-6">
                    <div className=" w-full bg-slate-600 rounded-lg ">
                      <div className=" px-6 text-white bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md text-center">
                        <button
                          onClick={handleButtonClick}
                          className="px-6 py-1  text-white"
                        >
                          Cambiar Logo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="">
                        <div className="flex justify-center items-center ">
                          <img
                            src={LogoBlanco}
                            alt=""
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" text-xs px-2 text-gray-500 text-semibold">
                      Recomendaciones: Webp, Logo blanco, tamaño máximo de 100KB
                      y 300 x 140 pixeles.
                    </div>
                    <div className=" w-full bg-white rounded-lg ">
                      <div className=" px-6 py-0 text-white bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md text-center">
                        <button
                          onClick={handleButtonClick}
                          className="px-6 py-1  text-white"
                        >
                          Cambiar Logo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="">
                        <div className="flex justify-center items-center ">
                          <img src={LogoOscuro} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className=" text-xs px-2 text-gray-500 text-semibold">
                      Recomendaciones: Webp, Logo oscuro, tamaño máximo de 100KB
                      y 300 x 140 pixeles.
                    </div>
                    <div className="w-full">
                      <BlockPicker
                        color={localColor}
                        onChange={handleColorChange}
                        width="100%"
                      />

                      {/* <p>Color PDF seleccionado: {color}</p> */}
                      {/* <div
                        style={{
                          backgroundColor: color,
                          width: "100px",
                          height: "100px",
                        }}
                      ></div> */}
                    </div>
                    <div className=" text-xs px-2 text-gray-500 text-semibold">
                      Recomendaciones: Webp, Logo blanco, tamaño máximo de 100KB
                      y 300 x 140 pixeles.
                    </div>
                  </div>
                  <div className="space-y-6 mr-4 border-2 rounded-t-xl bg-white shadow  ScrollTable">
                    <div className="bg-blue-400 rounded-lg  px-4 py-1 text-white">
                      <h1>Mi perfil</h1>
                    </div>
                    <div className="p-4 space-y-6 ">
                      <div className="grid grid-cols-3 gap-x-4">
                        <div className="relative z-0 w-full  group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            value="COMERCIAL ELIAS A & G S.A.C."
                            className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Razon Social
                          </label>
                        </div>
                        <div className="relative z-0 w-full  group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            value="20451488156"
                            className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            RUC
                          </label>
                        </div>
                        <div className="relative z-0 w-full  group"></div>
                      </div>
                      <div className="grid grid-cols-[1.5fr,1fr] gap-x-4">
                        <div className="relative z-0 w-full  group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            value="CAL.LOS CARDOS MZA. P LOTE. 13 URB. PANDO IX ETAPA"
                            className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Direccion
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
                            Numero
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-x-4">
                        <div className="relative  w-full  group">
                          <Select
                            styles={customStyles2}
                            options={options}
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3   origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Departamento
                          </label>
                        </div>
                        <div className="relative w-full  group">
                          <Select
                            styles={customStyles2}
                            options={options}
                          ></Select>
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Provincia
                          </label>
                        </div>
                        <div className="relative  w-full  group">
                          <Select
                            styles={customStyles2}
                            options={options}
                          ></Select>{" "}
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Distrito
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-x-4">
                        <div className="relative z-0 w-full  group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            value="981742009"
                            className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono
                          </label>
                        </div>
                        <div className="relative z-0 w-full  group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            value="comag_sac@gmail.com"
                            className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0   appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Correo
                          </label>
                        </div>
                        <div className="relative z-0 w-full  group"></div>
                      </div>
                      <div className="INFO SUNAT space-y-6">
                        <div className="bg-blue-400 w-ful rounded-md px-2 text-white py-1">
                          <h1>Informacion SUNAT</h1>
                        </div>
                        <div className="Cuerpo grid grid-cols-3 px-2 gap-x-4">
                          <div className="relative z-0 w-full    group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Usuario SOL
                            </label>
                          </div>
                          <div className="relative z-0 w-full   group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Clave SOL
                            </label>
                          </div>
                          <div className="relative z-0 w-full   group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Clave Certificado
                            </label>
                          </div>
                        </div>
                        <div className="Cuerpo flex justify-between gap-x-2 px-2 w-full ">
                          <div className="flex gap-x-2">
                            <div className="">
                              <div className=" items-center space-x-2 ">
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                  <span>Certificado</span>
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
                            <label htmlFor="" className="text-gray-500">
                              Certificado.pfx
                            </label>
                          </div>{" "}
                          <div className="flex bg-green-400  px-2  align-middle self-center rounded-md items-center text-white">
                            <p className="  text-2xl font-bold">
                              <IconoCheck />
                            </p>
                            <p className=" text-sm ">CERTIFICADO CARGADO</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 px-2 ">
                          <span>
                            *Dato sensible al activar Envío a Producción,
                            verificar si está seguro.
                          </span>
                        </div>
                      </div>
                      <div className="APISUNAT space-y-6">
                        <div className="bg-blue-400 w-ful rounded-md px-2 text-white py-1">
                          <h1>API SUNAT</h1>
                        </div>
                        <div className="Cuerpo grid grid-cols-3 px-2 gap-x-4">
                          <div className="relative z-0 w-full    group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Usuario API
                            </label>
                          </div>
                          <div className="relative z-0 w-full   group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Clave API
                            </label>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 px-2 ">
                          <span>
                            *Los envíos de Guía de Remisión son directamente a
                            producción SUNAT
                          </span>
                        </div>
                      </div>
                      <div className="Detracciones space-y-6">
                        <div className="bg-blue-400 w-ful rounded-md px-2 text-white py-1">
                          <h1 className="bg-blue-400">
                            Cuenta de Detracciones
                          </h1>
                        </div>
                        <div className="Cuerpo grid grid-cols-3 px-2">
                          <div className="relative w-full group ">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              value="00-031-027829"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium  absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              N° de Cta. del Banco de la Nacion
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="DebitoAutomatico space-y-6">
                        <div className="bg-blue-400 w-ful rounded-md px-2 text-white py-1">
                          <h1>Cuentas Bancarias</h1>
                        </div>
                        <div className="Cuerpo grid grid-cols-3 px-2 gap-x-4">
                          <div className="relative z-0 w-full    group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Cuenta Bancaria 1
                            </label>
                          </div>
                          <div className="relative z-0 w-full   group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Cuenta Bancaria 2
                            </label>
                          </div>
                          <div className="relative z-0 w-full   group">
                            <input
                              type="text"
                              name="contacto_area"
                              id="contacto_area"
                              className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder=" "
                              required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                              Cuenta Bancaria 3
                            </label>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 px-2 ">
                          <span>
                            *Es indispensable que la cuenta bancaria sea válida
                            y se encuentre registrada a nombre de la empresa o
                            persona jurídica
                          </span>
                        </div>
                      </div>
                      <div className="REGISTRASERIES space-y-6">
                        <div className="bg-blue-400 w-ful rounded-md px-2 text-white py-1">
                          <h1>Registra tus Series</h1>
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 px-2">
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
                              Factura
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
                              Boleta
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
                              Nota de Credito Factura
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 px-2">
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
                              Nota de Credito Boleta
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
                              Nota de Debito Factura
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
                              Nota de Debito Boleta
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 px-2">
                          <div className="relative z-0 w-full  group"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 px-2">
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
                              Comunicacion de Baja
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
                              Reversion
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
                              Guia de Remision Remitente
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-4 px-2">
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
                              Guia de Remision Transportista
                            </label>
                          </div>
                          <div className="relative z-0 w-full  group"></div>
                        </div>
                      </div>
                      <div className="Botones">
                        <div className="flex justify-end gap-x-6 ">
                          <button
                            onClick={CerraModal}
                            className="px-6 py-2 text-white bg-gradient-to-t   from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br rounded-md"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveColor}
                            className="px-6 py-2 text-white bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br rounded-md"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracion;
