import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SearchVendedor from "../Components/SearchVendedor";
function ModalCrearArea({ modalNuevo, setModalNuevo, actualizarTabla }) {
  // Funcion Ocultar Modal
  const ocultarModal = () => {
    setModalNuevo(false);
  };

  const [formData, setFormData] = useState({
    id_cliente_area: "",
    nombre_area: "",
    contacto_area: "",
    cargo_contacto_area: "",
    telefono_area: "",
    email_area: "",
    contacto_extra_area: "",
    telefono_extra_area: "",
    email_extra_area: "",
  });

  // Nuevo estado para indicar el reinicio del formulario
  const [resetForm, setResetForm] = useState(false);

  const [imagenUsuario, setImagenUsuario] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      // Manejar la carga de la imagen
      const file = e.target.files[0];
      setImagenUsuario(file);
    } else {
      // Manejar otros campos de entrada
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetFormState = () => {
    // Cambia el estado de resetForm para reiniciar el formulario
    setResetForm((prevResetForm) => !prevResetForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append(
      "id_creador_area",
      localStorage.getItem("id_usuario")
    );
    formDataWithImage.append("id_cliente_area", formData.id_cliente_area);
    formDataWithImage.append("nombre_area", formData.nombre_area);
    formDataWithImage.append("contacto_area", formData.contacto_area);
    formDataWithImage.append(
      "cargo_contacto_area",
      formData.cargo_contacto_area
    );
    formDataWithImage.append("telefono_area", formData.telefono_area);
    formDataWithImage.append("email_area", formData.email_area);
    formDataWithImage.append(
      "contacto_extra_area",
      formData.contacto_extra_area
    );
    formDataWithImage.append(
      "telefono_extra_area",
      formData.telefono_extra_area
    );
    formDataWithImage.append("email_extra_area", formData.email_extra_area);

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
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Area/guardar_area.php",
        {
          method: "POST",
          body: formDataWithImage,
        }
      );

      if (response.ok) {
        ocultarModal();
        // Muestra una alerta de éxito
        Swal.fire({
          icon: "success",
          title: "Guardado",
          text: "Los datos se han guardado correctamente.",
        });
        actualizarTabla();
        // Resetea el formulario después de la presentación exitosa
        resetFormState();
      } else {
        // Verifica el error mandado por la API
        const errorResponse = await response.json();
        const errorMessage =
          errorResponse.error || "Hubo un error al intentar guardar los datos.";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar guardar los datos.",
      });
    }
  };

  // Clientes / Select
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Obtener departamentos
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
    )
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error fetching Clientes:", error));
  }, []);

  return (
    <>
      {/* cuando le de a cancelar display: none */}
      <div
        className={`side-panel-container ${
          modalNuevo ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10`}
      >
        {/* cuando le de a cancelar translate-x-[100%] */}
        <div
          className={`side-panel-cont-container ${
            modalNuevo ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[500px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 `}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 mb-6">
            <div className="side-panel-iframe relative w-full h-full overflow-y-auto ScrollTableVertical ">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-2 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Nueva Area</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form
                        className="text-black"
                        key={resetForm}
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        <div className="relative z-0 w-full mb-6 group ">
                          <div
                            type="select"
                            name="id_cliente_area"
                            id="id_cliente_area"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleInputChange}
                            required
                          >
                            <SearchVendedor
                              vendedores={clientes}
                              setSelectedVendedor={(cliente) =>
                                setFormData({
                                  ...formData,
                                  id_cliente_area: cliente.id,
                                })
                              }
                            />
                          </div>
                          <label className="peer-focus:font-medium absolute text-md duration-300 text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Filtrar Cliente *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="nombre_area"
                            id="nombre_area"
                            onChange={handleInputChange}
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Area *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="contacto_area"
                            id="contacto_area"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Contacto *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="cargo_contacto_area"
                            id="cargo_contacto_area"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Cargo Contacto *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="telefono_area"
                            id="telefono_area"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            pattern="^[0-9]+$"
                            maxLength={9}
                            onChange={handleInputChange}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="email"
                            name="email_area"
                            id="email_area"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Email *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="contacto_extra_area"
                            id="contacto_extra_area"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Contacto Extra *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="telefono_extra_area"
                            id="telefono_extra_area"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            pattern="^[0-9]+$"
                            maxLength={9}
                            onChange={handleInputChange}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono Extra *
                          </label>
                        </div>

                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="email"
                            name="email_extra_area"
                            id="email_extra_area"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Email extra *
                          </label>
                        </div>
                        <div className="flex items-center justify-end rounded-b mt-7">
                          <button
                            type="submit"
                            className="text-white bg-gradient-to-t from-blue-400 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={ocultarModal}
                            type="button"
                            className="text-white bg-gradient-to-t from-gray-400 via-gray-500 to-gray-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-gray-300  rounded-lg text-sm text-center font-medium px-5 py-2.5 mr-4"
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
        </div>
      </div>
    </>
  );
}

export default ModalCrearArea;
