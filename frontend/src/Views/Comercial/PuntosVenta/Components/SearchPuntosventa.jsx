import { useState } from "react";
import { Imprimir } from "../../../../Iconos/Iconos-NavBar";
import Swal from "sweetalert2";
const SearchPuntosventa = ({
  titlle,
  tipoComprobante,
  clienteElegido,
  areaElegida,
  onFetchData,
  cargarListaEnvios,
  onSearch,
  actualizarTabla,
}) => {
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
      if (!tipoComprobante || !clienteElegido || !areaElegida) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, complete todos los campos requeridos.",
        });
        return;
      }
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Comercial/PuntoVenta/guardarCotizacion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoComprobante,
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
    onFetchData();
  };

  return (
    <>
      <div className="-mt-[8px] pb-3 w-full ">
        <div className="text-white grid h-full w-full items-center  grid-cols-[auto,2fr,auto] justify-between bg-var(--gris) ">
          <h1 className="text-3xl pr-5 font-semibold">{titlle}</h1>
          {/* Componente Buscador De tablas */}
          <input
            className=" ml-4 text-slate-800  font-semibold rounded-[10px]   bg-white  bg-opacity-80  focus:bg-[rgba(255,255,255,1)]  outline-none px-5 py-2  w-[50%]  "
            type="text"
            placeholder="Buscar Datos "
            value={searchValue}
            onChange={handleSearchChange}
          />

          <div className="relative flex  ml-10">
            <button
              onClick={handleGenerarCotizacion}
              className="bg-gradient-to-t h-10 from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
              px-8 tracking-wide text-[18px] font-semibold  rounded-[10px]  ml-4"
            >
              Generar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPuntosventa;
