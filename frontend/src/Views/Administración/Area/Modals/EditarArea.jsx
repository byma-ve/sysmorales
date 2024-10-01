import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import SearchVendedor from "../Components/SearchVendedor";
function ModalEditarArea({
  modalEditar,
  setModalEditar,
  selectedAreaData,
  actualizarTabla,
}) {
  const ocultarModal2 = () => {
    setModalEditar(false);
    resetFormState();
  };

  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    id: "",
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
  const [imagenCliente, setImagenCliente] = useState(null);

  useEffect(() => {
    setFormValues({
      id: selectedAreaData?.id || "",
      id_cliente_area: selectedAreaData?.id_cliente_area || "",
      nombre_area: selectedAreaData?.nombre_area || "",
      contacto_area: selectedAreaData?.contacto_area || "",
      cargo_contacto_area: selectedAreaData?.cargo_contacto_area || "",
      telefono_area: selectedAreaData?.telefono_area || "",
      email_area: selectedAreaData?.email_area || "",
      contacto_extra_area: selectedAreaData?.contacto_extra_area || "",
      telefono_extra_area: selectedAreaData?.telefono_extra_area || "",
      email_extra_area: selectedAreaData?.email_extra_area || "",
    });
  }, [selectedAreaData, modalEditar]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setImagenCliente(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  // Clientes / Select
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Obtener departamentos
    fetch(
      "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Cliente/obtener_clientes.php"
    )
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error("Error fetching Clientes:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("id", formValues.id);
    formDataWithImage.append("id_cliente_area", formValues.id_cliente_area);
    formDataWithImage.append("nombre_area", formValues.nombre_area);
    formDataWithImage.append("contacto_area", formValues.contacto_area);
    formDataWithImage.append(
      "cargo_contacto_area",
      formValues.cargo_contacto_area
    );
    formDataWithImage.append("telefono_area", formValues.telefono_area);
    formDataWithImage.append("email_area", formValues.email_area);
    formDataWithImage.append(
      "contacto_extra_area",
      formValues.contacto_extra_area
    );
    formDataWithImage.append(
      "telefono_extra_area",
      formValues.telefono_extra_area
    );
    formDataWithImage.append("email_extra_area", formValues.email_extra_area);

    try {
      const response = await fetch(
        "https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Area/actualizar_area.php",
        {
          method: "POST",
          body: formDataWithImage,
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Guardado",
          text: "Los datos se han actualizado correctamente.",
        });
        actualizarTabla();
        ocultarModal2();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al actualizar el area.",
        });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
  };

  const [resetForm, setResetForm] = useState(false);
  const resetFormState = () => {
    // Cambia el estado de resetForm para reiniciar el formulario
    setResetForm((prevResetForm) => !prevResetForm);
  };

  return (
    <>
      {/* cuando le de a cancelar display: none */}
      <div
        className={`side-panel-container ${
          modalEditar ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10`}
      >
        {/* cuando le de a cancelar translate-x-[100%] */}
        <div
          className={`side-panel-cont-container ${
            modalEditar ? "translate-x-[0%]" : "translate-x-[100%]"
          } w-[500px] h-full block absolute top-0 right-0 bottom-0 bg-slate-100 transition-transform duration-1000 `}
        >
          <div className="side-panel-content-container block absolute top-0 right-0 bottom-0 left-0 mb-6">
            <div className="side-panel-iframe relative w-full h-full overflow-y-auto ScrollTableVertical">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-2 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Editar Area</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form
                        key={resetForm}
                        className="text-black"
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
                            onChange={handleChange}
                            value={formValues.id_cliente_area}
                            required
                          >
                            <SearchVendedor
                              vendedores={clientes}
                              selectedVendedorId={formValues.id_cliente_area}
                              setSelectedVendedor={(cliente) =>
                                setFormValues((formValues) => ({
                                  ...formValues,
                                  id_cliente_area: cliente.id,
                                }))
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
                            onChange={handleChange}
                            value={formValues.nombre_area}
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
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
                            value={formValues.contacto_area}
                            onChange={handleChange}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
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
                            onChange={handleChange}
                            value={formValues.cargo_contacto_area}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
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
                            onChange={handleChange}
                            value={formValues.telefono_area}
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
                            onChange={handleChange}
                            value={formValues.email_area}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
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
                            onChange={handleChange}
                            value={formValues.contacto_extra_area}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
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
                            onChange={handleChange}
                            value={formValues.telefono_extra_area}
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
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.email_extra_area}
                            onInput={event => {
                              event.target.value = event.target.value.toUpperCase();
                            }}
                          />
                          <label className="uppercase peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
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
                            onClick={ocultarModal2}
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

export default ModalEditarArea;
