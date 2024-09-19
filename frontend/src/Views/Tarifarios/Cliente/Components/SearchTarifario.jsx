import { useState } from "react";
import { IconoExcel } from "../../../../Iconos/Iconos-NavBar";
import ExcelJS from "exceljs";

import ElegirClienteTarif from "../Modals/ElegirCliente";
import ElegirAreaTarif from "../Modals/ElegirAreaTarif";
import ElegirTarifario from "../Modals/ElegirTarifario";
import { ImportarPlantilla } from "../Modals/ImportarPlantilla";

const SearchTarifario = ({
  onOptionChange,
  onSearch,
  onOptionCliente,
  onOptionArea,
  actualizarTabla,
}) => {
  const [mostrarExportar, setMostrarModalExportar] = useState(false);
  const modalExportar = () => {
    setMostrarModalExportar(!mostrarExportar);
  };

  // Estados para controlar la habilitación de los botones
  const [areaButtonDisabled, setAreaButtonDisabled] = useState(true);
  const [tarifarioButtonDisabled, setTarifarioButtonDisabled] = useState(true);
  const [exportarButtonDisabled, setExportarButtonDisabled] = useState(true);

  // Mostrar Clientes a Elegir
  const [mostrarElegirCliente, setMostrarElegirCliente] = useState(false);
  // Mostrar Area a Elegir
  const [mostrarElegirArea, setMostrarElegirArea] = useState(false);
  // Mostrar Tarifa a Elegir
  const [mostrarElegirTarifa, setMostrarElegirTarifa] = useState(false);
  // Obtener Cliente Seleccionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  // Obtener Area Seleccionada
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  // Obtener Tarifa Seleccionada
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);
  // Modal de Importar Plantilla
  const [modalMasivo, setModalMasivo] = useState(false);

  const handleOpenModal = () => {
    setModalMasivo(true);
  };

  const cerrarModalCliente = () => {
    setMostrarElegirCliente(false);
  };

  const cerrarModalAreas = () => {
    setMostrarElegirArea(false);
  };

  const cerrarModalTarifario = () => {
    setMostrarElegirTarifa(false);
  };

  const toggleElegirCliente = () => {
    setMostrarElegirCliente(!mostrarElegirCliente);
    cerrarModalAreas();
    cerrarModalTarifario();
  };
  const toggleElegirArea = () => {
    setMostrarElegirArea(!mostrarElegirArea);
    cerrarModalCliente();
    cerrarModalTarifario();
  };
  const toggleElegirTarifa = () => {
    setMostrarElegirTarifa(!mostrarElegirTarifa);
    cerrarModalCliente();
    cerrarModalAreas();
  };

  // Cliente Seleccionado
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setAreaSeleccionada(null);
    setTarifaSeleccionada(null);

    // Aquí es donde haces que mostrarElegirArea y mostrarElegirTarifa sean false
    setMostrarElegirArea(false);
    setMostrarElegirTarifa(false);

    toggleElegirCliente();
    setAreaButtonDisabled(false);
    setTarifarioButtonDisabled(true);
    setExportarButtonDisabled(true);

    onOptionCliente(cliente.id);
  };

  // Area Seleccionado
  const seleccionarArea = (area) => {
    setAreaSeleccionada(area);
    setTarifaSeleccionada(null);

    setMostrarElegirTarifa(false);

    toggleElegirArea();
    setTarifarioButtonDisabled(false);
    setExportarButtonDisabled(true);

    onOptionArea(area.id);
  };

  // Tarifa Seleccionado
  const seleccionarTarifa = (tarifa) => {
    setTarifaSeleccionada(tarifa);
    toggleElegirTarifa();
    onOptionChange(tarifa);
    setExportarButtonDisabled(false);
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  async function descargarTabla() {
    try {
      let apiUrl;
      if (tarifaSeleccionada === "Courier") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/exportarCourrier.php?id_cliente=${encodeURIComponent(
          clienteSeleccionado?.id
        )}&id_area=${encodeURIComponent(areaSeleccionada?.id)}`;
      }
      if (tarifaSeleccionada === "Aereo") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/exportarAereo.php?id_cliente=${encodeURIComponent(
          clienteSeleccionado?.id
        )}&id_area=${encodeURIComponent(areaSeleccionada?.id)}`;
      }
      if (tarifaSeleccionada === "Valorizado") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/exportarValorizado.php?id_cliente=${encodeURIComponent(
          clienteSeleccionado?.id
        )}&id_area=${encodeURIComponent(areaSeleccionada?.id)}`;
      }
      if (tarifaSeleccionada === "Carga") {
        apiUrl = `https://sysdemo.byma-ve.com/BackendApiRest/Tarifarios/Cliente/exportarCarga.php?id_cliente=${encodeURIComponent(
          clienteSeleccionado?.id
        )}&id_area=${encodeURIComponent(areaSeleccionada?.id)}`;
      }

      const response = await fetch(apiUrl);
      const datos = await response.json();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Tabla");

      let encabezados;
      if (datos.length > 0) {
        encabezados = Object.keys(datos[0]);
      } else if (
        tarifaSeleccionada === "Courier" ||
        tarifaSeleccionada === "Aereo"
      ) {
        encabezados = [
          "Departamento",
          "Provincia",
          "Distrito",
          "KG",
          "KG Adicional",
          "T.Min Entrega",
          "T.Max Entrega",
        ];
      } else if (tarifaSeleccionada === "Valorizado") {
        encabezados = [
          "Departamento",
          "Provincia",
          "Distrito",
          "Producto",
          "S/ Producto",
          "T.Min Entrega",
          "T.Max Entrega",
        ];
      } else if (tarifaSeleccionada === "Carga") {
        encabezados = [
          "Departamento",
          "Provincia",
          "Distrito",
          "KG Maximo",
          "KG Base",
          "Paquete",
          "T.Min Entrega",
          "T.Max Entrega",
        ];
      }
      worksheet.addRow(encabezados);

      datos.forEach((fila) => {
        const valores = encabezados.map((campo) => fila[campo]);
        worksheet.addRow(valores);
      });

      const blob = await workbook.xlsx.writeBuffer();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Datos_${tarifaSeleccionada}_${clienteSeleccionado.razon_social_cliente}_${areaSeleccionada.nombre_area}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
    }
  }

  async function descargarUbigeo() {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/exportarUbigeo.php`
      );
      const datos = await response.json();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ubigeo");

      const encabezados = Object.keys(datos[0]);
      worksheet.addRow(encabezados);

      datos.forEach((fila) => {
        const valores = encabezados.map((campo) => fila[campo]);
        worksheet.addRow(valores);
      });

      const blob = await workbook.xlsx.writeBuffer();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ubigeo.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo Excel:", error);
    }
  }

  return (
    <>
      <div className="ml-1  px-4 pb-4 w-full">
        <div className="text-white  h-full w-full flex justify-between bg-var(--gris) ">
          <input
            className=" text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[25%] "
            type="text"
            placeholder="Filtrar y Buscar"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className="flex ">
            <div>
              <input
                className=" h-10 w-[350px] px-6 mx-2 text-sm font-semibold  text-slate-700  bg-white hover:bg-slate-200 
                border-none rounded-xl  outline-none cursor-pointer"
                onClick={toggleElegirCliente}
                placeholder="Elegir Cliente"
                value={clienteSeleccionado?.razon_social_cliente || ""}
                readOnly
              ></input>
              {/* Modal de Clientes */}
              {mostrarElegirCliente && (
                <ElegirClienteTarif
                  toggleElegirCliente={toggleElegirCliente}
                  seleccionarCliente={seleccionarCliente}
                />
              )}
            </div>
            <div>
              <input
                className=" h-10  px-6 mx-2 text-sm font-semibold  text-slate-700  bg-white hover:bg-slate-200 
                border-none rounded-xl  outline-none cursor-pointer"
                onClick={toggleElegirArea}
                placeholder="Elegir Area"
                value={areaSeleccionada?.nombre_area || ""}
                readOnly
                disabled={areaButtonDisabled} // Desactivar el botón si areaButtonDisabled es true
              ></input>
              {/* Modal de Area */}
              {mostrarElegirArea && (
                <ElegirAreaTarif
                  toggleElegirArea={toggleElegirArea}
                  seleccionarArea={seleccionarArea}
                  id_cliente={clienteSeleccionado?.id || ""}
                />
              )}
            </div>
            <div>
              <input
                className=" h-10  px-6 mx-2 text-sm font-semibold  text-slate-700  bg-white hover:bg-slate-200 
                border-none rounded-xl  outline-none cursor-pointer"
                onClick={toggleElegirTarifa}
                placeholder="Elegir Tarifario"
                value={tarifaSeleccionada || ""}
                readOnly
                disabled={tarifarioButtonDisabled} // Desactivar el botón si tarifarioButtonDisabled es true
              ></input>
              {/* Modal de Tarifa */}
              {mostrarElegirTarifa && (
                <ElegirTarifario
                  toggleElegirTarifa={toggleElegirTarifa}
                  seleccionarTarifa={seleccionarTarifa}
                />
              )}
            </div>
            <div className="flex">
              {mostrarExportar && (
                <div className="absolute bg-sky-50 rounded-lg shadow whitespace-nowrap right-[4.2%] top-[15rem] text-left z-10">
                  <ul className="p-3 overflow-y-auto text-sm text-gray-200">
                    <div
                      onClick={descargarTabla}
                      className="flex items-center  rounded hover:bg-gray-200"
                    >
                      <label className="w-full py-1 px-3  text-sm font-medium text-gray-900 rounded cursor-pointer">
                        Exportar Tabla
                      </label>
                    </div>
                    <div className="flex items-center  rounded hover:bg-gray-200">
                      <label
                        onClick={descargarUbigeo}
                        className="w-full py-1 px-3  text-sm font-medium text-gray-900 rounded cursor-pointer"
                      >
                        Exportar Ubigeo
                      </label>
                    </div>
                    <div
                      className="flex items-center  rounded hover:bg-gray-200"
                      onClick={handleOpenModal}
                    >
                      <label className="w-full py-1 px-3  text-sm font-medium text-gray-900 rounded cursor-pointer">
                        Importar Plantilla
                      </label>
                    </div>
                  </ul>
                </div>
              )}
              <button
                onClick={modalExportar}
                className={`p-2 mx-2 text-xl text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl    ${
                !tarifarioButtonDisabled ? "" : "cursor-not-allowed"
              }`}
                disabled={exportarButtonDisabled}
              >
                <IconoExcel />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ImportarPlantilla
        actualizarTabla={actualizarTabla}
        modalMasivo={modalMasivo}
        setModalMasivo={setModalMasivo}
        id_cliente={clienteSeleccionado?.id || ""}
        id_area={areaSeleccionada?.id || ""}
        tarifario={tarifaSeleccionada || ""}
      />
    </>
  );
};

export default SearchTarifario;
