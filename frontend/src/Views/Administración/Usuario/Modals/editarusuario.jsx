import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

function ModalEditarUsuario({
  modalEditar,
  setModalEditar,
  selectedUserData,
  actualizarTabla,
}) {
  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    id: "",
    dni_usuario: "",
    clave_usuario: "",
    colaborador_usuario: "",
    brevete_usuario: "",
    telefono_usuario: "",
    email_usuario: "",
    area_usuario: "",
    cargo_usuario: "",
    foto_usuario: null,
  });

  const [imagenUsuario, setImagenUsuario] = useState(null);

  useEffect(() => {
    setFormValues({
      id: selectedUserData?.id || "",
      dni_usuario: selectedUserData?.dni_usuario || "",
      clave_usuario: selectedUserData?.clave_usuario || "",
      colaborador_usuario: selectedUserData?.colaborador_usuario || "",
      brevete_usuario: selectedUserData?.brevete_usuario || "",
      telefono_usuario: selectedUserData?.telefono_usuario || "",
      email_usuario: selectedUserData?.email_usuario || "",
      area_usuario: selectedUserData?.area_usuario || "",
      cargo_usuario: selectedUserData?.cargo_usuario || "",
      foto_usuario: selectedUserData?.foto_usuario || "",
    });
  }, [selectedUserData, modalEditar]);

  const ocultarModal2 = () => {
    fileInputRef.current.value = "";
    setModalEditar(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setImagenUsuario(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("id", formValues.id);
    formDataWithImage.append("dni_usuario", formValues.dni_usuario);
    formDataWithImage.append("clave_usuario", formValues.clave_usuario);
    formDataWithImage.append(
      "colaborador_usuario",
      formValues.colaborador_usuario
    );
    formDataWithImage.append("brevete_usuario", formValues.brevete_usuario);
    formDataWithImage.append("telefono_usuario", formValues.telefono_usuario);
    formDataWithImage.append("email_usuario", formValues.email_usuario);
    formDataWithImage.append("area_usuario", formValues.area_usuario);
    formDataWithImage.append("cargo_usuario", formValues.cargo_usuario);
    formDataWithImage.append("foto_usuario", imagenUsuario);

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
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/actualizar_usuario.php",
        {
          method: "POST",
          body: formDataWithImage,
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        actualizarTabla();
        ocultarModal2();
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
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
  const options = [
    { value: "", label: "Elegir Cargo..." },
    { value: "auxiliar", label: "Auxiliar de Distribución" },
    { value: "conductor", label: "Conductor" },
    { value: "vendedor", label: "Vendedor" },
    { value: "jefe de operaciones", label: "Jefe de operaciones" },
    { value: "auxiliar logistico", label: "Auxiliar Logistico" },
    { value: "coordinador logistico", label: "Coordinador Logistico" },
    { value: "atencion al cliente", label: "Atencion al cliente" },
    { value: "auxiliar contable", label: "Auxiliar contable" },
    { value: "gerente comercial", label: "Gerente comercial" },
    { value: "gerente general", label: "Gerente general" },
    { value: "supervisor logistico", label: "Supervisor Logistico" },
    { value: "administrador de sistema", label: "Administrador de Sistema" },
    { value: "asistente contable", label: "Asistente contable" },
  ];

  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "0px",
      height: "16px",
      borderBottom: "1px solid #9ca3af",
      boxShadow: "none",
      "&:active": {
        borderColor: "#0389fb ",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "10px 0",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "45px",
    }),

    menu: (provided) => ({
      ...provided,
      marginTop: "5px",
      borderRadius: "4px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      borderRadius: "5px",
    }),
  };

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      cargo_usuario: value,
    }));
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
            <div className="side-panel-iframe relative w-full h-full overflow-y-auto ScrollTableVertical ">
              <div className="side-panel  h-full w-auto m-0 ">
                <div className="side-cont-titulo py-2 text-[25px] font-medium px-6 bg-blue-500 text-white mb-6 opacity-80">
                  <div className="side-titulo  pb-2">
                    <h1 className="side-txt">Editar Usuario</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="text-black"
                      >
                        <div className="relative  w-full mb-6 group ">
                          <div className=" w-full">
                            <Select
                              placeholder="Elegir Cargo"
                              styles={customStyles2}
                              options={options}
                              type="select"
                              className="block py-2.5 px-0 w-full text-sm"
                              classNamePrefix="react-select"
                              value={
                                formValues.cargo_usuario
                                  ? options.find(
                                      (option) =>
                                        option.value === formValues.cargo_usuario
                                    )
                                  : null
                              }
                              name="cargo_usuario"
                              id="cargo_usuario"
                              onChange={handleSelectChange}
                              required
                            ></Select>
                          </div>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Cargo *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="dni_usuario"
                            value={formValues.dni_usuario}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            disabled
                            pattern="^[0-9]+$"
                            maxLength={11}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            DNI
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="clave_usuario"
                            id="clave_usuario"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.clave_usuario}
                            onChange={handleChange}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Clave *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="colaborador_usuario"
                            id="colaborador_usuario"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.colaborador_usuario}
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Colaborador *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="brevete_usuario"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.brevete_usuario}
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Brevete *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="telefono_usuario"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.telefono_usuario}
                            onChange={handleChange}
                            pattern="^[0-9]+$"
                            maxLength={9}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="email"
                            name="email_usuario"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.email_usuario}
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Email *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="area_usuario"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.area_usuario}
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Area *
                          </label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-6 group">
                          <select
                            onChange={handleChange}
                            type="select"
                            name="cargo_usuario"
                            id="cargo_usuario"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            value={formValues.cargo_usuario}
                            required
                          >
                            <option value="" className="bg-gray-200">
                              Elegir Cargo...
                            </option>
                            <option value="auxiliar" className="bg-gray-200">
                              Auxiliar de Distribución
                            </option>
                            <option value="conductor" className="bg-gray-200">
                              Conductor
                            </option>
                            <option value="vendedor" className="bg-gray-200">
                              Vendedor
                            </option>
                            <option
                              value="jefe de operaciones"
                              className="bg-gray-200"
                            >
                              Jefe de operaciones
                            </option>
                            <option
                              value="auxiliar logistico"
                              className="bg-gray-200"
                            >
                              Auxiliar Logistico
                            </option>
                            <option
                              value="coordinador logistico"
                              className="bg-gray-200"
                            >
                              Coordinador Logistico
                            </option>
                            <option
                              value="atencion al cliente"
                              className="bg-gray-200"
                            >
                              Atencion al cliente
                            </option>
                            <option
                              value="auxiliar contable"
                              className="bg-gray-200"
                            >
                              Auxiliar contable
                            </option>
                            <option
                              value="gerente comercial"
                              className="bg-gray-200"
                            >
                              Gerente comercial
                            </option>
                            <option
                              value="gerente general"
                              className="bg-gray-200"
                            >
                              Gerente general
                            </option>
                            <option
                              value="supervisor logistico"
                              className="bg-gray-200"
                            >
                              Supervisor Logistico
                            </option>
                            <option
                              value="administrador de sistema"
                              className="bg-gray-200"
                            >
                              Administrador de Sistema
                            </option>
                            <option
                              value="asistente contable"
                              className="bg-gray-200"
                            >
                              Asistente contable
                            </option>
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Cargo *
                          </label>
                        </div> */}
                        <div className="flex relative z-0 w-full mb-6 group">
                          <input
                            type="file"
                            name="foto_usuario"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=""
                            ref={fileInputRef}
                            onChange={handleChange}
                            accept="image/*"
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Foto
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

export default ModalEditarUsuario;
