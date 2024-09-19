import { useState } from "react";
function Encabezado({ titlle, onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  return (
    <>
      <div className=" -mt-[8px] pb-3 w-full ">
        <div className="text-white grid h-full w-full items-center  grid-cols-[auto,2fr,auto] justify-between bg-var(--gris) ">
          <h1 className="text-3xl pr-5 font-semibold">{titlle}</h1>
          {/* Componente Buscador De tablas */}
          <input
            className=" text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[50%]  "
            type="text"
            placeholder="Buscar Datos "
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </>
  );
}

export default Encabezado;
