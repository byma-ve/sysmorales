import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import { useState } from "react";
import Fechas from "../Modals/Fechas";
import ExcelJS from "exceljs";

const SearchSeguimiento = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  // Estado para guardar las fechas
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Variable que controla si se muestra el modal de fechas o no
  const [calendarioClickeado, setCalendarioClickeado] = useState(false);

  // Funcion para detectar la fecha inicial
  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
  };

  // Función para detectar la fecha final
  const handleFechaHastaChange = (event) => {
    setFechaHasta(event.target.value);
  };

  // Determina si el botón debe estar deshabilitado
  const isBotonDeshabilitado = !fechaDesde.trim() || !fechaHasta.trim();

  // Cambia el estado cuando se hace clic en el calendario
  const handleCalendarioClick = () => {
    handleCloseModal();
    setCalendarioClickeado(true);
  };

  // Cerrar Modal
  const handleCloseModal = () => {
    setCalendarioClickeado(false);
  };

  function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  async function descargarExcel() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/lista_despacho.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      await workbook.xlsx.load(arrayBuffer);
      const worksheet = workbook.getWorksheet(1);

      const ahora = new Date();
      let horas = ahora.getHours();
      let minutos = ahora.getMinutes();
      let segundos = ahora.getSeconds();
      const ampm = horas >= 12 ? "P.M." : "A.M.";

      horas = horas % 12;
      horas = horas ? horas : 12;
      minutos = minutos < 10 ? "0" + minutos : minutos;
      segundos = segundos < 10 ? "0" + segundos : segundos;

      const fechaHoraActual = `${ahora.getDate()}/${
        ahora.getMonth() + 1
      }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("D7").value = `Desde: ${formatearFecha(fechaDesde)}`;
      worksheet.getCell("D8").value = `Hasta: ${formatearFecha(fechaHasta)}`;

      const apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Despacho/obtenerDespachosFechas.php?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 11 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.fecha_creado;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value =
            rowData.id_num_manifiesto_despacho;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value =
            rowData.guia_transportista_despacho;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value =
            rowData.id_transportista_despacho;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.destino;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.vehiculo_asignado;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.placa_vehiculo;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.conductor;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.auxiliar;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value =
            rowData.cantidad_bultos_despacho;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.total_guias;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Despachos-${fechaDesde}-a-${fechaHasta}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  return (
    <>
      <div className="text-gray-900 flex justify-between mb-3 align-middle ">
        <input
          className="ml-4 text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[50%]  "
          type="text"
          placeholder="Buscar Datos "
          value={searchValue}
          onChange={handleSearchChange}
        />
        <div className="relative flex mr-5">
          <button
            onClick={handleCalendarioClick}
            className="calendario px-[10px]   p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
            border-none rounded-xl mx-2 "
          >
            <Calendario />
          </button>
          <button
            onClick={descargarExcel}
            className={`px-[10px]   p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
            border-none rounded-xl  ${
              isBotonDeshabilitado
                ? "cursor-not-allowed"
                : " hover:bg-[rgba(255,255,255,0.5)]"
            } border-none rounded-xl`}
            disabled={isBotonDeshabilitado}
          >
            <IconoExcel />
          </button>
        </div>
      </div>
      <Fechas
        handleFechaDesdeChange={handleFechaDesdeChange}
        handleFechaHastaChange={handleFechaHastaChange}
        calendarioClickeado={calendarioClickeado}
        setCalendarioClickeado={setCalendarioClickeado}
      />
    </>
  );
};

export default SearchSeguimiento;
