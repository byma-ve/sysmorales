import { useState } from "react";

const SearchAdmin = ({
  mostrarModalNuevo,
  titlle,
  btntittle,
  onSearch,
  apiData,
  apiEncabezado,
}) => {
  const [mostrarExportar, setMostrarModalExportar] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const modalExportar = () => {
    setMostrarModalExportar(!mostrarExportar);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Lista ${titlle.replace("Crear ", "")}`
    );
    worksheet.columns = apiEncabezado.map((header) => ({
      header,
      key: header,
    }));
    worksheet.addRows(apiData.map((d) => Object.values(d)));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Data${titlle.replace("Crear ", "")}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `Lista ${titlle.replace("Crear ", "")}`
    );
    worksheet.columns = apiEncabezado.map((header) => ({
      header,
      key: header,
    }));
    worksheet.addRows(apiData.map((d) => Object.values(d)));
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Data${titlle.replace("Crear ", "")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="ml-1 px-4 pb-3 w-full ">
        <div className="text-white grid h-full w-full items-center  grid-cols-[auto,2fr,auto] justify-between bg-var(--gris) ">
          <h1 className="text-3xl pr-5 font-semibold">{titlle}</h1>
          {/* Componente Buscador De tablas */}
          <input
            className=" text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[60%] "
            type="text"
            placeholder="Buscar Datos "
            value={searchValue}
            onChange={handleSearchChange}
          />

          <div className="relative flex  ml-10">
            <button
              onClick={mostrarModalNuevo}
              className="bg-gradient-to-t   h-10 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
              px-8 tracking-wide text-[18px] font-semibold  rounded-[10px] mr-3 ml-7"
            >
              {btntittle}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchAdmin;
