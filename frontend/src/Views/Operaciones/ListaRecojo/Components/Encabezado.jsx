import { useState } from "react";
import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import Fechas from "../Modals/Fechas";
import ExcelJS from "exceljs";

function Encabezado({ titlle, onSearch }) {
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
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  async function descargarExcel() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/lista_recojos.xlsx");
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

      const fechaHoraActual = `${ahora.getDate()}/${ahora.getMonth() + 1
        }/${ahora.getFullYear()} - ${horas}:${minutos}:${segundos} ${ampm}`;

      worksheet.getCell("D6").value = fechaHoraActual;
      worksheet.getCell("D7").value = `Desde: ${formatearFecha(fechaDesde)}`;
      worksheet.getCell("D8").value = `Hasta: ${formatearFecha(fechaHasta)}`;

      const apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/ListaRecojos/exportarListaRecojos.php?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
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
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_recojo;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.id_orden_servicio_recojo;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.fecha_programacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.hora_programacion;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.razon_social_cliente;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.destino_recojo;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.comentario_estado_recojo;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ListaRecojos-${fechaDesde}-a-${fechaHasta}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  return (
    <>
      <div className="-mt-[8px] mb-3 w-full">
        <div className="text-white grid h-full w-full grid-cols-[auto,2fr,auto] justify-between bg-var(--gris)">
          <h1 className="text-3xl pr-5 font-semibold">{titlle}</h1>
          <div className="flex items-center space-x-4">
            <input
              className=" text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[50%]  "
              type="text"
              placeholder="Buscar.. "
              value={searchValue}
              onChange={handleSearchChange}
            />
            <div className="relative flex ml-3">
              <button
                onClick={handleCalendarioClick}
                className="px-[10px] mx-2  p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl "
              >
                <Calendario />
              </button>
              <button
                className={`px-[10px]   p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
                border-none rounded-xl 
                ${isBotonDeshabilitado
                    ? "cursor-not-allowed"
                    : " hover:bg-[rgba(255,255,255,0.5)]"
                  } 
                border-none rounded-xl`}
                disabled={isBotonDeshabilitado}
                onClick={descargarExcel}
              >
                <IconoExcel />
              </button>
            </div>
          </div>
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
}

export default Encabezado;
