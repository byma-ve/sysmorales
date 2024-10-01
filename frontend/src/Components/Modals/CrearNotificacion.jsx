import Swal from "sweetalert2";
import { IconoClientes } from "../../Iconos/Iconos-NavBar";

export const CrearNotificacion = ({
  cargarNotificaciones,
  modalAlerta,
  ocultarModalAlerta,
  mostrarModalClientes,
  clienteData,
  setClienteData,
  setUsuarios,
  agregarNuevaAlerta,
}) => {
  const handleChange = (e) => {
    setClienteData({
      ...clienteData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "usuarios") {
      setUsuarios(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const camposVacios = Object.values(clienteData).some(
      (value) => !value.trim()
    );
    if (camposVacios) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }
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
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Notificaciones/guardarNotificacion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteData),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        // agregarNuevaAlerta(clienteData);
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
      cargarNotificaciones();
      limpiarCampos();
      ocultarModalAlerta();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Red",
      });
      console.log(error);
    }
  };

  const limpiarCampos = () => {
    setClienteData({
      tituloNotificacion: "",
      fechaVigente: "",
      usuarios: "",
      mensaje: "",
      id_emisor: localStorage.getItem("id_usuario"),
    });
  };

  const handleCancelar = () => {
    limpiarCampos();
    ocultarModalAlerta();
  };

  return (
    <>
      <div
        className={`side-panel-container ${
          modalAlerta ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-[12] flex justify-center items-center`}
      >
        <div
          className={`side-panel-cont-container ${
            modalAlerta ? "translate-y-[00%]" : "translate-y-[200%]"
          } w-[520px] block absolute transition-transform duration-500`}
        >
          <div className="side-panel-content-container p-4 ">
            <div className="side-panel-iframe h-full">
              <div className="side-panel bg-white  h-full w-auto m-0 rounded-md">
                <div className="side-cont-titulo mb-6 text-[25px] px-5 py-2 rounded-t-md bg-blue-400 w-full font-semibold text-white">
                  <div className="side-titulo flex w-full">
                    <h1 className="side-txt mr-9 w-full">Crear Notificacion</h1>
                  </div>
                </div>
                <div className="section-crm pb-6 px-6">
                  <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex mb-4">
                      <div className="flex flex-col mr-4">
                        <label
                          htmlFor="tituloNotificacion"
                          className="text-sm font-medium text-gray-600"
                        >
                          Título de Notificación
                        </label>
                        <input
                          type="text"
                          id="tituloNotificacion"
                          name="tituloNotificacion"
                          value={clienteData.tituloNotificacion}
                          onChange={handleChange}
                          className="mt-2 p-1 border rounded-md focus:ring-1 focus:outline-none focus:ring-blue-300"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="fechaVigente"
                          className="text-sm font-medium text-gray-600"
                        >
                          Fecha Vigente
                        </label>
                        <input
                          type="date"
                          id="fechaVigente"
                          name="fechaVigente"
                          value={clienteData.fechaVigente}
                          onChange={handleChange}
                          className="mt-2 p-1 border rounded-md w-56 text-[14px] text-gray-600 focus:ring-1 focus:outline-none focus:ring-blue-300"
                        />
                      </div>
                    </div>
                    <div className="mb-4 relative">
                      <label
                        htmlFor="usuarios"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Usuarios
                      </label>
                      <input
                        readOnly
                        type="text"
                        id="usuarios"
                        name="usuarios"
                        value={clienteData.usuarios}
                        onChange={handleChange}
                        className="mt-2 p-4 border rounded-md w-full focus:ring-1 focus:outline-none focus:ring-blue-300"
                      />
                      <div
                        className="absolute top-0 right-0 text-2xl text-blue-400"
                        onClick={mostrarModalClientes}
                      >
                        <IconoClientes />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="mensaje"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Mensaje
                      </label>
                      <input
                        type="text"
                        id="mensaje"
                        name="mensaje"
                        value={clienteData.mensaje}
                        onChange={handleChange}
                        className="mt-2 p-4 border rounded-md w-full focus:ring-1  focus:outline-none focus:ring-blue-300"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-4 mt-1">
                      <button
                        type="submit"
                        className="text-white  bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-gray-800"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelar}
                        className="text-white  bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
