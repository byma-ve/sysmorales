import { useState } from "react";
import Swal from "sweetalert2";
import { IconoExcel } from "../../../../Iconos/Iconos-NavBar";
import ExcelJS from "exceljs";

function Encabezado({
  titlle,
  btntittle,
  clienteElegido,
  areaElegida,
  cargarListaEnvios,
  onSearch,
  actualizarTabla,
}) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleGenerarCotizacion = async () => {
    // ESTILOS DE PRECARGADO
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "transparent",
      html: `
          <div class="papapa"> 
            <div class="loader1"> 
            <h1 class="guardado" >Guardando...</h1>
            </div>
          
            <div class="loader2">
              <div class="justify-content-center jimu-primary-loading"></div>
            </div>
          </div>
        `,
      onBeforeOpen: () => {
        // Función que se ejecuta antes de que se abra la ventana modal
        Swal.showLoading(); // Muestra una animación de carga dentro de la ventana modal
      },
    });
    try {
      if (!clienteElegido || !areaElegida) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, complete todos los campos requeridos.",
        });
        return;
      }
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/RegistroMasivo/guardarCotizacion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteElegido,
            areaElegida,
            id_creador: localStorage.getItem("id_usuario"),
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.mensaje,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.mensaje,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Red",
      });
      console.log(error);
    }
    actualizarTabla();
    cargarListaEnvios();
  };

  async function descargarTabla() {
    try {
      // Define manualmente los encabezados
      const encabezados = [
        "CONSIGNADO",
        "RUC/DNI",
        "TELÉFONO",
        "TELÉFONO-EX",
        "DIRECCIÓN",
        "REFERENCIAS",
        "TIPO-ENVIO",
        "DEPARTAMENTO",
        "PROVINCIA",
        "DISTRITO",
        "TIPO-MOVIMIENTO",
        "TIPO-LOGISTICA",
        "CONTENIDO-MERC",
        "PESO-MERC",
        "CANT-MERC",
        "LARGO",
        "ANCHO",
        "ALTO",
        "VALOR-MERCANCÍA",
        "G-TRANSPORTISTA",
        "G-REMISIÓN",
        "NRO. PEDIDO",
        "DOC-ADICIONAL",
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Carga Masiva");

      // Agrega los encabezados a la hoja de trabajo
      worksheet.addRow(encabezados);

      const buffer = await workbook.xlsx.writeBuffer();

      const url = window.URL.createObjectURL(new Blob([buffer]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Carga_Masiva.xlsx`;
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
      <div className="-mt-[8px]  pb-3 w-full ">
        <div className="text-white grid h-full w-full items-center  grid-cols-[auto,2fr,auto] justify-between bg-var(--gris) ">
          <h1 className="text-3xl pr-5 font-semibold">{titlle}</h1>
          {/* Componente Buscador De tablas */}
          <input
            className="  text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[60%]  "
            type="text"
            placeholder="Buscar.. "
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className="relative flex  ">
            <button
              onClick={descargarTabla}
              className="px-[10px]   p-[5px] text-lg text-white bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.5)] 
              border-none rounded-xl "
            >
              <IconoExcel />
            </button>

            <button
              onClick={handleGenerarCotizacion}
              disabled={!(clienteElegido && areaElegida)}
              className={`bg-gradient-to-t from-blue-400 h-10 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
              px-8 tracking-wide text-[18px] font-semibold  rounded-[10px]   ml-4 ${
                !(clienteElegido && areaElegida) ? "cursor-not-allowed" : ""
              }`}
            >
              {btntittle}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Encabezado;
