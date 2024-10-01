import { useState, useEffect } from "react";
import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import Fechas from "../Modals/Fechas";
import SearchCliente from "./SearchCliente";
import SearchArea from "./SearchArea";
import ExcelJS from "exceljs";

const SearchSeguimiento = ({ titlle, onSearch }) => {
  // Estados para controlar la habilitación de los botones
  const [calendarioButtonDisabled, setCalendarioButtonDisabled] =
    useState(true);
  const [exportarButtonDisabled, setExportarButtonDisabled] = useState(true);
  const [areaButtonDisabled, setArearButtonDisabled] = useState(true);
  // Estado para guardar las fechas
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Variable que controla si se muestra el modal de fechas o no
  const [calendarioClickeado, setCalendarioClickeado] = useState(false);
  // Mostrar Agentes a Elegir
  const [mostrarElegirAgente, setMostrarElegirAgente] = useState(false);
  // Obtener Agente Seleccionado
  const [agenteSeleccionado, setAgenteSeleccionado] = useState(null);
  // Mostrar Area a Elegir
  const [mostrarElegirArea, setMostrarElegirArea] = useState(false);
  // Obtener Area Seleccionado
  const [areaSeleccionado, setAreaSeleccionado] = useState(null);
  // Funcion para detectar la fecha inicial
  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
    setExportarButtonDisabled(false);
  };

  // Estado para controlar si se ha seleccionado un cliente
  const [clienteSeleccionado, setClienteSeleccionado] = useState(false);

  // Función para manejar la selección de cliente
  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(true);
    // Habilitar la selección de área
    setAreaButtonDisabled(false);
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
  // Mostrar Lista de Agentes
  const toggleElegirAgente = () => {
    setMostrarElegirAgente(!mostrarElegirAgente);
  };
  // Agente Seleccionado
  const seleccionarAgente = (agente) => {
    setAgenteSeleccionado(agente);
    toggleElegirAgente();
    setArearButtonDisabled(false);
  };
  // Mostrar Lista de Agentes
  const toggleElegirArea = () => {
    setMostrarElegirArea(!mostrarElegirArea);
  };
  // Agente Seleccionado
  const seleccionarArea = (area) => {
    setAreaSeleccionado(area);
    toggleElegirArea();
    setCalendarioButtonDisabled(false);
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  //BACKEND

  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch(
      "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
    )
      .then((response) => response.json())
      .then((data) => setClientes(data));
  }, []);

  const [idCliente, setIdCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const handleSelectCliente = (selectedCliente) => {
    if (selectedCliente) {
      setIdCliente(selectedCliente.id);
      setAreas([]);
      setIdArea("");
      setCalendarioButtonDisabled(true);
      setExportarButtonDisabled(true);
      setFechaHasta("");
      setFechaDesde("");
      setNombreCliente(selectedCliente.razon_social_cliente);
    } else {
      setIdCliente("");
      setAreas([]);
      setIdArea("");
      setCalendarioButtonDisabled(false);
      setFechaHasta("");
      setFechaDesde("");
      setExportarButtonDisabled(true);
      setNombreCliente("Todos");
      setNombreArea("Todos");
    }
  };

  const [areas, setAreas] = useState([]);
  const [nombreArea, setNombreArea] = useState([]);

  useEffect(() => {
    if (idCliente) {
      fetch(
        `https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Area/obtenerAreasTarifario.php?id_cliente=${idCliente}`
      )
        .then((response) => response.json())
        .then((data) => setAreas(data));
    }
  }, [idCliente]);

  const [idArea, setIdArea] = useState("");
  const handleSelectArea = (selectedArea) => {
    if (selectedArea) {
      setIdArea(selectedArea.id);
      setCalendarioButtonDisabled(false);
      setExportarButtonDisabled(true);
      setNombreArea(selectedArea.nombre_area);
    }
  };

  function formatearFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  async function descargarExcel() {
    const workbook = new ExcelJS.Workbook();
    try {
      const response = await fetch("/seguimiento.xlsx");
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
      worksheet.getCell("D7").value = nombreCliente;
      worksheet.getCell("D8").value = nombreArea;
      worksheet.getCell("D9").value = `Desde: ${formatearFecha(fechaDesde)}`;
      worksheet.getCell("D10").value = `Hasta: ${formatearFecha(fechaHasta)}`;

      const apiUrl = `https://sistema.transportesmorales-logistik.com/BackendApiRest/Operaciones/Seguimiento/exportarSeguimiento.php?id_cliente=${idCliente}&id_area=${idArea}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
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
          worksheet.getCell(`B${rowNumber}`).value = rowData.estado_operacion;
          worksheet.getCell(`B${rowNumber}`).style = cellStyle;
          worksheet.getCell(`C${rowNumber}`).value = rowData.fecha_operacion;
          worksheet.getCell(`C${rowNumber}`).style = cellStyle;
          worksheet.getCell(`D${rowNumber}`).value = rowData.hora_operacion;
          worksheet.getCell(`D${rowNumber}`).style = cellStyle;
          worksheet.getCell(`E${rowNumber}`).value = rowData.orden_servicio;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value =
            rowData.razon_social_cliente;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.nombre_area;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.destino_partida;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value = rowData.nombre_consignado;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.destino_llegada;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.direccion_envio;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.contenido_envio;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.cantidad_envio;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
          worksheet.getCell(`O${rowNumber}`).value = rowData.peso_masa_envio;
          worksheet.getCell(`O${rowNumber}`).style = cellStyle;
          worksheet.getCell(`P${rowNumber}`).value = rowData.peso_volumen_envio;
          worksheet.getCell(`P${rowNumber}`).style = cellStyle;
          worksheet.getCell(`Q${rowNumber}`).value = rowData.lead_time;
          worksheet.getCell(`Q${rowNumber}`).style = cellStyle;
          worksheet.getCell(`R${rowNumber}`).value = rowData.tiempo_entrega;
          worksheet.getCell(`R${rowNumber}`).style = cellStyle;
          worksheet.getCell(`S${rowNumber}`).value = rowData.entrega_status;
          worksheet.getCell(`S${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Seguimiento-${fechaDesde}-a-${fechaHasta}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Hubo un error al cargar el archivo Excel", error);
    }
  }

  return (
    <>
      <div className="-mt-[8px] text-white flex justify-between  mb-4 align-middle items-center ">
        <div className="flex w-full items-center ">
          <h1 className="text-3xl font-semibold ">{titlle}</h1>
          <input
            className=" ml-4 text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[55%] "
            type="text"
            placeholder="Buscar Datos..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center ">
          <div className="flex  gap-4">
            <div className="Elegir Cliente">
              <button>
                <SearchCliente
                  clientes={clientes}
                  handleSelectCliente={handleSelectCliente}
                />
              </button>
            </div>
            <div className="Elegir Area">
              <button>
                <SearchArea
                  areas={areas}
                  idCliente={idCliente}
                  handleSelectArea={handleSelectArea}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleCalendarioClick}
            className={`px-[10px] mx-3  p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
            border-none rounded-xl 
                ${
                  calendarioButtonDisabled
                    ? "cursor-not-allowed"
                    : " hover:bg-[rgba(255,255,255,0.5)]"
                } 
                border-none rounded-xl`}
            disabled={calendarioButtonDisabled}
          >
            <Calendario />
          </button>
          <button
            className={`px-[10px]   p-3 text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
            border-none rounded-xl   ${
              !exportarButtonDisabled ? "" : "cursor-not-allowed"
            }`}
            disabled={exportarButtonDisabled}
            onClick={descargarExcel}
          >
            <IconoExcel />
          </button>
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
};

export default SearchSeguimiento;
