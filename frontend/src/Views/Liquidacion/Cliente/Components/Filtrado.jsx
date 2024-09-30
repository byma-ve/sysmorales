import { useState, useEffect } from "react";
import { IconoExcel, Calendario } from "../../../../Iconos/Iconos-NavBar";
import Fechas from "../Modals/Fechas";
import SearchCliente from "./SearchCliente";
import SearchArea from "./SearchArea";
import Select from "react-select";
import ExcelJS from "exceljs";

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
  const [clienteButtonDisabled, setClienteButtonDisabled] = useState(true);
  const [exportarButtonDisabled, setExportarButtonDisabled] = useState(true);

  // Mostrar Clientes a Elegir
  const [mostrarElegirCliente, setMostrarElegirCliente] = useState(false);
  // Mostrar Areas a Elegir
  const [mostrarElegirArea, setMostrarElegirArea] = useState(false);
  // Obtener Cliente Seleccionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  // Obtener Area Seleccionado
  const [areaSeleccionado, setAreaSeleccionado] = useState(null);
  // Estado para guardar las fechas
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Variable que controla si se muestra el modal de fechas o no
  const [calendarioClickeado, setCalendarioClickeado] = useState(false);

  // Mostrar Lista de Clientes
  const toggleElegirCliente = () => {
    setMostrarElegirCliente(!mostrarElegirCliente);
  };
  // Mostrar Lista de Areas
  const toggleElegirArea = () => {
    setMostrarElegirArea(!mostrarElegirArea);
  };

  // Calendario Seleccionado
  const seleccionarArea = (area) => {
    setAreaSeleccionado(area);
    toggleElegirArea();
    // Habilitar el botón de Elegir Area al seleccionar un cliente
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

  const handleSeleccionarCliente = (cliente) => {
    seleccionarCliente(cliente);
  };

  const handleSeleccionarArea = (area) => {
    seleccionarArea(area);
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
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedClientes = data.map((cliente) => ({
          value: cliente.id,
          label: cliente.razon_social_cliente,
        }));
        setClientes(transformedClientes);
      });
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
        `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/obtenerAreasTarifario.php?id_cliente=${idCliente}`
      )
        .then((response) => response.json())
        .then((data) => {
          const transformedClientes = data.map((areas) => ({
            value: areas.id,
            label: areas.nombre_area,
          }));
          setAreas(transformedClientes);
        });
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
      const response = await fetch("/liquidacion_cliente.xlsx");
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

      const apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Liquidacion/LiquidacionCliente/exportarLiquidiacionCliente.php?id_cliente=${idCliente}&id_area=${idArea}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
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
          worksheet.getCell(`E${rowNumber}`).value = rowData.fecha_orden;
          worksheet.getCell(`E${rowNumber}`).style = cellStyle;
          worksheet.getCell(`F${rowNumber}`).value = rowData.orden_servicio;
          worksheet.getCell(`F${rowNumber}`).style = cellStyle;
          worksheet.getCell(`G${rowNumber}`).value = rowData.destino_entrega;
          worksheet.getCell(`G${rowNumber}`).style = cellStyle;
          worksheet.getCell(`H${rowNumber}`).value = rowData.guia_tracking;
          worksheet.getCell(`H${rowNumber}`).style = cellStyle;
          worksheet.getCell(`I${rowNumber}`).value = rowData.num_intentos;
          worksheet.getCell(`I${rowNumber}`).style = cellStyle;
          worksheet.getCell(`J${rowNumber}`).value =
            rowData.estado_ultimo_intento;
          worksheet.getCell(`J${rowNumber}`).style = cellStyle;
          worksheet.getCell(`K${rowNumber}`).value = rowData.costo_envio;
          worksheet.getCell(`K${rowNumber}`).style = cellStyle;
          worksheet.getCell(`L${rowNumber}`).value = rowData.costo_adicionales;
          worksheet.getCell(`L${rowNumber}`).style = cellStyle;
          worksheet.getCell(`M${rowNumber}`).value = rowData.sub_total;
          worksheet.getCell(`M${rowNumber}`).style = cellStyle;
          worksheet.getCell(`N${rowNumber}`).value = rowData.igv;
          worksheet.getCell(`N${rowNumber}`).style = cellStyle;
          worksheet.getCell(`O${rowNumber}`).value = rowData.precio_total;
          worksheet.getCell(`O${rowNumber}`).style = cellStyle;
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LiquidacionCliente-${fechaDesde}-a-${fechaHasta}.xlsx`;
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
          <div className="cont-fecha flex justify-between gap-x-4 ">
            <div className="">
              {/* <SearchCliente clientes={clientes} handleSelectCliente={handleSelectCliente} /> */}
              <Select
                options={clientes}
                styles={customStyles}
                onChange={(selectedOption) =>
                  handleSelectCliente({
                    id: selectedOption.value,
                    razon_social_cliente: selectedOption.label, // Asegúrate de que `label` sea el nombre que necesitas
                  })
                }
                placeholder="Filtrar Cliente"
                className="w-[320px] h-[38px] bg-white rounded-lg"
              />
            </div>
            <div className=" w-full  ">
              {/* <SearchArea
                areas={areas}
                idCliente={idCliente}
                handleSelectArea={handleSelectArea}
              /> */}
              <Select
                options={areas}
                styles={customStyles}
                onChange={(selectedOption) =>
                  handleSelectArea({
                    id: selectedOption.value,
                    nombre_area: selectedOption.label, // Asegúrate de que `label` sea el nombre que necesitas
                  })
                }
                value={
                  idArea
                    ? areas.find(
                        (option) =>
                          option.value === idArea
                      )
                    : null
                }
                placeholder="Filtrar Area"
                className=" w-[16.8rem] h-[38px] bg-white rounded-lg"
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
              <button
                className={`exportar px-[10px] mx-2  p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
                border-none rounded-xl mr-4 ${
                  !exportarButtonDisabled ? "" : "cursor-not-allowed"
                }`}
                disabled={exportarButtonDisabled}
                onClick={descargarExcel}
              >
                <IconoExcel className="excel text-white" />
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
