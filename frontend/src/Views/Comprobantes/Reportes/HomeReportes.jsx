import React, { useState } from "react";
import Home from "../../../Layout/Home";
import Select from "react-select";
import Tabla from "./Components/tabla";
import { IconoExcel } from "../../../Iconos/Iconos-NavBar";
const options = [
  { value: "Todos", label: "Todos" },
  { value: "En proceso", label: "En proceso" },
  { value: "Validado", label: "Validado" },
  { value: "Error", label: "Error" },
  { value: "Dado de baja", label: "Dado de baja" },
];
const HomeReportes = () => {
  const [estado, setEstado] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const isFormValid = estado && fechaDesde && fechaHasta;
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
    <Home
      children2={
        <>
          {" "}
          <div className="bg-white px-10 pt-6  rounded-xl">
            <h2 className="text-2xl font-bold mb-6   rounded">
              Todos Comprobantes Enviados
            </h2>

            <form className="mb-6 grid grid-cols-4 gap-10 w-full ">
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
                  RUC/DNI/CE del adquiriente
                </label>
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
                    Razon Social
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
                    N° de Comprobante
                  </label>
                </div>
              </div>
              <div className="relative z-10 w-[115%]  group">
                <Select
                  placeholder="Estado"
                  styles={customStyles2}
                  options={options}
                  onChange={(selectedOption) => setEstado(selectedOption)}
                ></Select>
              </div>
              <div className="col-span-5 grid grid-cols-5 gap-10">
                <div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="date"
                      name="contacto_area"
                      id="contacto_area"
                      className=" block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      Fecha de Emision DESDE *
                    </label>
                  </div>
                </div>
                <div>
                  <div className="relative z-0 w-full group">
                    <input
                      type="date"
                      name="contacto_area"
                      id="contacto_area"
                      className="hideen block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      required
                    />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                      {" "}
                      Fecha de Emision HASTA *
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
                      Serie
                    </label>
                  </div>
                </div>{" "}
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
                    Correlativo DESDE *
                  </label>
                </div>
                <div className="relative z-0 w-full group">
                  <input
                    type="date"
                    name="contacto_area"
                    id="contacto_area"
                    className="hideen block py-[9px] px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder="Hasta "
                    required
                  />
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                    {" "}
                    Correlativo HASTA *
                  </label>
                </div>
              </div>
            </form>
            <div className="  flex  justify-end gap-4 mb-3 border-b pb-8 border-gray-400">
              <button className="bg-gradient-to-t  py-2 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br text-white  px-8 rounded-md">
                Buscar
              </button>
              <button
                className={` text-[30px] text-green-600 bg-white rounded-xl  transition-all ${
                  isFormValid
                    ? "hover:bg-green-100 cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                disabled={!isFormValid}
              >
                <IconoExcel />
              </button>{" "}
            </div>
            <div className="mb-4 flex justify-end"></div>
            <div className="TABLA">
              <Tabla />
            </div>
          </div>
        </>
      }
    ></Home>
  );
};

export default HomeReportes;
