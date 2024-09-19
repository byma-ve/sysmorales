import { useState } from "react";
const SearchSeguimiento = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <>
      <div className="text-white flex justify-between  mb-4 align-middle ">
        <div className="flex w-[100%]">
          <h1 className="text-3xl font-semibold whitespace-nowrap ">
            Permisos de Usuarios
          </h1>
          <input
            className="ml-4 text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[130%] "
            type="text"
            placeholder="Buscar Datos "
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className=" w-full relative flex justify-end "></div>
        </div>
        <div className="flex"></div>
      </div>
    </>
  );
};

export default SearchSeguimiento;
