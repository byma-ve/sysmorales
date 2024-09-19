import { useState, useEffect } from "react";
import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import Fechas from "../Modals/Fechas";
import SearchVendedor from "./SearchVendedor";
import ExcelJS from "exceljs";
function Filtrado({ onSearch }) {
  // Estados para controlar la habilitación de los botones
  const [calendarioButtonDisabled, setCalendarioButtonDisabled] =
    useState(true);
  const [exportarButtonDisabled, setExportarButtonDisabled] = useState(true);
  // Mostrar Agentes a Elegir
  const [mostrarElegirAgente, setMostrarElegirAgente] = useState(false);
  // Obtener Agente Seleccionado
  const [agenteSeleccionado, setAgenteSeleccionado] = useState(null);
  // Estado para guardar las fechas
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Variable que controla si se muestra el modal de fechas o no
  const [calendarioClickeado, setCalendarioClickeado] = useState(false);

  // Mostrar Lista de Agentes
  const toggleElegirAgente = () => {
    setMostrarElegirAgente(!mostrarElegirAgente);
  };

  // Agente Seleccionado
  const seleccionarAgente = (agente) => {
    setAgenteSeleccionado(agente);
    toggleElegirAgente();
    setCalendarioButtonDisabled(false);
  };
  // Funcion para detectar la fecha inicial
  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
    setExportarButtonDisabled(false);
  };

  // Función para detectar la fecha final
  const handleFechaHastaChange = (event) => {
    setFechaHasta(event.target.value);
    setExportarButtonDisabled(false);
  };

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

  const [agentes, setAgentes] = useState([]);

  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtener_vendedores.php"
    )
      .then((response) => response.json())
      .then((data) => setAgentes(data));
  }, []);

  const [idAgente, setIdAgente] = useState("");
  const [nombreAgente, setNombreAgente] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const handleSelectAgente = (selectedAgente) => {
    if (selectedAgente) {
      setIdAgente(selectedAgente.id);
      setCalendarioButtonDisabled(false);
      setExportarButtonDisabled(true);
      setFechaHasta("");
      setFechaDesde("");
      setNombreAgente(selectedAgente.colaborador_usuario);
      setNombreContacto(selectedAgente.area_usuario);
    } else {
      setIdAgente("");
      setCalendarioButtonDisabled(false);
      setFechaHasta("");
      setFechaDesde("");
      setExportarButtonDisabled(true);
      setNombreAgente("Todos");
      setNombreContacto("Todos");
    }
  };

  function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  async function descargarExcel() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/liquidacion_vendedor.xlsx");
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
      worksheet.getCell("D7").value = nombreAgente;
      worksheet.getCell("D8").value = nombreContacto;
      worksheet.getCell("D9").value = `Desde: ${formatearFecha(fechaDesde)}`;
      worksheet.getCell("D10").value = `Hasta: ${formatearFecha(fechaHasta)}`;

      const apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Liquidacion/LiquidacionVendedor/exportarLiquidacionVendedor.php?id_usuario=${idAgente}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
      });
      const apiData = await apiResponse.json();

      if (Array.isArray(apiData)) {
        for (let i = 0; i < apiData.length; i++) {
          const rowData = apiData[i];
          const rowNumber = 13 + i;
          const cellStyle = {
            font: { name: "Arial", size: 8, color: { argb: "FF000000" } },
            alignment: { horizontal: "center" },
          };
          worksheet.getCell(`B${rowNumber}`).value = rowData.fecha_creado;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.id_cotizacion;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.vendedor;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.cliente;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.costo_envio;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.costo_adicional;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.venta;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.comision;
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
      link.download = `LiquidacionVendedor-${fechaDesde}-a-${fechaHasta}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  return (
    <>
      <div className="pb-4 cont-filtrar relative ml-3 mt-4 z-1">
        <div className="flex justify-between">
          <div className="cont-btn w-[50%] flex items-center">
            <input
              className=" text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[80%] "
              type="text"
              placeholder="Buscar Datos "
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <div className="cont-fecha flex justify-between">
            <div className="w-[100%]  ">
              <SearchVendedor
                agentes={agentes}
                handleSelectAgente={handleSelectAgente}
              />
            </div>
            <div className="cont-fecha flex ">
              <button
                onClick={handleCalendarioClick}
                className={`calendario px-[10px] mx-2  p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] border-none rounded-xl ${
                  !calendarioButtonDisabled ? "" : "cursor-not-allowed"
                }`}
                disabled={calendarioButtonDisabled}
              >
                <Calendario />
              </button>
            </div>
            <div className="btn-exportar flex text-[25px] justify-center">
              <button
                className={`exportar px-[10px] mx-2  p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl mr-4 ${
                !exportarButtonDisabled ? "" : "cursor-not-allowed"
              }`}
                disabled={exportarButtonDisabled}
                onClick={descargarExcel}
              >
                <IconoExcel className="configuracion text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Fechas
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        handleFechaDesdeChange={handleFechaDesdeChange}
        handleFechaHastaChange={handleFechaHastaChange}
        calendarioClickeado={calendarioClickeado}
        setCalendarioClickeado={setCalendarioClickeado}
      />
    </>
  );
}

export default Filtrado;
