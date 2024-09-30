import { useState, useEffect } from "react";
import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import Fechas from "../Modals/Fechas";
import SearchAgente from "./SearchAgente";
import ExcelJS from "exceljs";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    maxHeight: "30px",
    minHeight: "37px",
    height: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    backgroundColor: "transparent",
    border: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    fontSize: "14px",
    margin: "6px 0",
    padding: "8px 0px",
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    padding: "4px 12px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    //display: "none", Oculta el indicador
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta la barrita al lado del indicador
  }),
};
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
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_agentes.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedAgentes = data.map((agente) => ({
          value: agente.id,
          label: agente.razon_social_proveedor,
        }));
        setAgentes(transformedAgentes);
      });
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
      setNombreAgente(selectedAgente.razon_social_proveedor);
      setNombreContacto(selectedAgente.contacto_proveedor);
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
      const response = await fetch("/liquidacion_agente.xlsx");
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

      const apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Liquidacion/LiquidacionAgente/exportarLiquidacionAgente.php?id_agente=${idAgente}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
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
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_documento;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.tipo_documento;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.num_documento;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.num_manifiesto;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.fecha_emision;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.destino_entrega;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.agente;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.num_intentos;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value =
            rowData.estado_ultimo_intento;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.costos_envios;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.igv;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.precio_total;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LiquidacionAgente-${fechaDesde}-a-${fechaHasta}.xlsx`;
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
              className="  text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[80%] "
              type="text"
              placeholder="Buscar Datos "
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>

          <div className="cont-fecha flex justify-between ">
            {/* <SearchAgente
              agentes={agentes}
              handleSelectAgente={handleSelectAgente}
            /> */}
            <Select
              options={agentes}
              styles={customStyles}
              placeholder="Filtrar Agente"
              className="w-[350px] h-[38px] bg-white rounded-lg mr-4"
              onChange={(selectedOption) =>
                handleSelectAgente({
                  id: selectedOption.value,
                  razon_social_proveedor: selectedOption.label, // Asegúrate de que `label` sea el nombre que necesitas
                })
              }
              isClearable
            />

            <button
              onClick={handleCalendarioClick}
              className={`calendario px-[10px] mx-2  p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] border-none rounded-xl ${
                !calendarioButtonDisabled ? "" : "cursor-not-allowed"
              }`}
              disabled={calendarioButtonDisabled}
            >
              <Calendario />
            </button>

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
