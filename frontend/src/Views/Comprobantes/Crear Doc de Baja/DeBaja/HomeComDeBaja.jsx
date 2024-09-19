import React from "react";
import HeadersDoc from "../Components/HeadersDoc";
import Select from "react-select";
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
const HomeComDeBaja = () => {
  return (
    <>
      {" "}
      <div className="bg-white px-4  rounded-xl rounded-tl-none">
        <HeadersDoc name="Comunicacion de baja" tipo="RA" />
        <div className="p-8 bg-white ">
          <div className=" rounded-lg">
            <div className="grid grid-cols-[2fr,1fr] gap-x-10  pt-4 ">
              <div className="  flex items-center gap-x-10 ">
                <div className="relative z-0 w-full group">
                  <input
                    type="date"
                    name="contacto_area"
                    id="contacto_area"
                    className=" block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-[1px]  appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />

                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                    Fecha de Referencia *
                  </label>
                </div>
                <div className="relative  w-full group">
                  <Select
                    placeholder="Tipo de Documento"
                    styles={customStyles2}
                    options={optionsDOC}
                  ></Select>
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                    Tipo de Documento
                  </label>
                </div>
              </div>
              <div className=" mx-auto ">
                <button className="bg-gradient-to-t   from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br text-white py-2 px-8 rounded-md">
                  Filtrar
                </button>
              </div>
            </div>
            <div className="h-[10rem] bg-white"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeComDeBaja;
