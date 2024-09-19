import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import SearchVendedor from "../Components/SearchVendedor";
import Select from "react-select";

function ModalEditarCliente({
  modalEditar,
  setModalEditar,
  selectedClienteData,
  actualizarTabla,
}) {
  const ocultarModal2 = () => {
    setModalEditar(false);
    resetFormState();
  };

  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    id: "",
    dni_cliente: "",
    razon_social_cliente: "",
    representante_cliente: "",
    clave_cliente: "",
    id_vendedor_usuario_cliente: "",
    limite_credito_cliente: "",
    alerta_credito_cliente: "",
    ubigeo_cliente: "",
    direccion_cliente: "",
    referencias_cliente: "",
    contacto_cliente: "",
    telefono_cliente: "",
    email_cliente: "",
    area_cliente: "",
    logo_cliente: null,
  });
  const [imagenCliente, setImagenCliente] = useState(null);

  useEffect(() => {
    setFormValues({
      id: selectedClienteData?.id || "",
      dni_cliente: selectedClienteData?.dni_cliente || "",
      razon_social_cliente: selectedClienteData?.razon_social_cliente || "",
      representante_cliente: selectedClienteData?.representante_cliente || "",
      clave_cliente: selectedClienteData?.clave_cliente || "",
      id_vendedor_usuario_cliente:
        selectedClienteData?.id_vendedor_usuario_cliente || "",
      limite_credito_cliente: selectedClienteData?.limite_credito_cliente || "",
      alerta_credito_cliente: selectedClienteData?.alerta_credito_cliente || "",
      ubigeo_cliente: selectedClienteData?.ubigeo_cliente || "",
      direccion_cliente: selectedClienteData?.direccion_cliente || "",
      referencias_cliente: selectedClienteData?.referencias_cliente || "",
      contacto_cliente: selectedClienteData?.contacto_cliente || "",
      telefono_cliente: selectedClienteData?.telefono_cliente || "",
      email_cliente: selectedClienteData?.email_cliente || "",
      area_cliente: selectedClienteData?.area_cliente || "",
      logo_cliente: selectedClienteData?.logo_cliente || "",
    });
    setDepartamentoSeleccionado(selectedClienteData?.departamento_id || "");
    setProvinciaSeleccionada(selectedClienteData?.provincia_id || "");
  }, [selectedClienteData, modalEditar]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setImagenCliente(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  // Cargar Vendedores Desde API
  const [vendedores, setVendedores] = useState([]);
  useEffect(() => {
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/obtener_vendedores.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedVendedores = data.map((vendedor) => ({
          value: vendedor.id,
          label: vendedor.colaborador_usuario,
        }));
        setVendedores(transformedVendedores);
      })
      .catch((error) => console.error("Error fetching Vendedores:", error));
  }, []);

  // Departamento - Provincia - Distrito / Select
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

  useEffect(() => {
    // Obtener departamentos
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=departamentos"
    )
      .then((response) => response.json())
      .then((data) => setDepartamentos(data))
      .catch((error) => console.error("Error fetching departamentos:", error));
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      // Obtener provincias por departamento
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=provincias&id=${departamentoSeleccionado}`
      )
        .then((response) => response.json())
        .then((data) => setProvincias(data))
        .catch((error) => console.error("Error fetching provincias:", error));
    }
  }, [departamentoSeleccionado]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      // Obtener distritos por provincia
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=distritos&id=${provinciaSeleccionada}`
      )
        .then((response) => response.json())
        .then((data) => setDistritos(data))
        .catch((error) => console.error("Error fetching distritos:", error));
    }
  }, [provinciaSeleccionada]);

  const handleDepartamentoChange = (event) => {
    setDepartamentoSeleccionado(event.target.value);
    setProvinciaSeleccionada("");
    setDistritos([]);
  };

  const handleProvinciaChange = (event) => {
    setProvinciaSeleccionada(event.target.value);
  };

  const handleSelectVendedor = (vendedor) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      id_vendedor_usuario_cliente: vendedor.id, // Asume que `id` es la propiedad correcta
    }));
  };

  const [resetForm, setResetForm] = useState(false);

  //Mandar Datos A la API
  const resetFormState = () => {
    // Cambia el estado de resetForm para reiniciar el formulario
    setResetForm((prevResetForm) => !prevResetForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("id", formValues.id);
    formDataWithImage.append("dni_cliente", formValues.dni_cliente);
    formDataWithImage.append(
      "razon_social_cliente",
      formValues.razon_social_cliente
    );
    formDataWithImage.append(
      "representante_cliente",
      formValues.representante_cliente
    );
    formDataWithImage.append("clave_cliente", formValues.clave_cliente);
    formDataWithImage.append(
      "id_vendedor_usuario_cliente",
      formValues.id_vendedor_usuario_cliente
    );
    formDataWithImage.append(
      "limite_credito_cliente",
      formValues.limite_credito_cliente
    );
    formDataWithImage.append(
      "alerta_credito_cliente",
      formValues.alerta_credito_cliente
    );
    formDataWithImage.append("ubigeo_cliente", formValues.ubigeo_cliente);
    formDataWithImage.append("direccion_cliente", formValues.direccion_cliente);
    formDataWithImage.append(
      "referencias_cliente",
      formValues.referencias_cliente
    );
    formDataWithImage.append("contacto_cliente", formValues.contacto_cliente);
    formDataWithImage.append("telefono_cliente", formValues.telefono_cliente);
    formDataWithImage.append("email_cliente", formValues.email_cliente);
    formDataWithImage.append("area_cliente", formValues.area_cliente);
    formDataWithImage.append("logo_cliente", imagenCliente);

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Cliente/actualizar_cliente.php",
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

  const customStyles2 = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      fontSize: "14px",
      borderRadius: "0px",
      height: "16px",
      borderBottom: "2px solid #9ca3af",
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
      id_vendedor_usuario_cliente: value,
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
                    <h1 className="side-txt">Editar Cliente</h1>
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
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="dni_cliente"
                            id="dni_cliente"
                            value={formValues.dni_cliente}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            disabled
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            DNI
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="razon_social_cliente"
                            id="razon_social_cliente"
                            value={formValues.razon_social_cliente}
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            required
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Razon social *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="representante_cliente"
                            id="representante_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.representante_cliente}
                            onChange={handleChange}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Representante *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            id="clave_cliente"
                            name="clave_cliente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.clave_cliente}
                            onChange={handleChange}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Clave *
                          </label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-6 group">
                          <div
                            type="select"
                            name="id_vendedor_usuario_cliente"
                            id="id_vendedor_usuario_cliente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                          >
                            <SearchVendedor
                              vendedores={vendedores}
                              selectedVendedorId={
                                formValues.id_vendedor_usuario_cliente
                              }
                              setSelectedVendedor={(vendedor) =>
                                setFormValues((formValues) => ({
                                  ...formValues,
                                  id_vendedor_usuario_cliente: vendedor.id,
                                }))
                              }
                            />
                          </div>

                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Vendedor *
                          </label>
                        </div> */}
                        <div className="relative  w-full mb-4 group ">
                          <div className=" w-full">
                            <Select
                              name="id_vendedor_usuario_cliente"
                              id="id_vendedor_usuario_cliente"
                              placeholder="Elegir Vendedor"
                              styles={customStyles2}
                              options={vendedores}
                              className="block py-2.5 px-0 w-full text-sm"
                              classNamePrefix="react-select"
                              value={
                                formValues.id_vendedor_usuario_cliente
                                  ? vendedores.find(
                                      (option) =>
                                        option.value === formValues.id_vendedor_usuario_cliente
                                    )
                                  : null
                              }
                              onChange={handleSelectChange}
                              required
                            ></Select>
                          </div>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Vendedor *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="number"
                            name="limite_credito_cliente"
                            id="limite_credito_cliente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            step="0.0001"
                            value={formValues.limite_credito_cliente}
                            onChange={handleChange}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Limite de Credito *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="number"
                            name="alerta_credito_cliente"
                            id="alerta_credito_cliente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            step="0.0001"
                            value={formValues.alerta_credito_cliente}
                            onChange={handleChange}
                            readOnly
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Alerta Credito *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="departamento"
                            id="departamento"
                            value={departamentoSeleccionado}
                            onChange={handleDepartamentoChange}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          >
                            <option className="bg-gray-200">
                              Seleccionar Departamento
                            </option>
                            {departamentos.map((departamento) => (
                              <option
                                className="bg-gray-200"
                                key={departamento.id}
                                value={departamento.id}
                              >
                                {departamento.nombre_dep}
                              </option>
                            ))}
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Departamento *
                          </label>
                        </div>

                        <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="provincia"
                            id="provincia"
                            value={provinciaSeleccionada}
                            onChange={handleProvinciaChange}
                            disabled={!departamentoSeleccionado}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          >
                            <option className="bg-gray-200">
                              Seleccionar Provincia
                            </option>
                            {provincias.map((provincia) => (
                              <option
                                className="bg-gray-200"
                                key={provincia.id}
                                value={provincia.id}
                              >
                                {provincia.nombre_prov}
                              </option>
                            ))}
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Provincia *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="ubigeo_cliente"
                            id="ubigeo_cliente"
                            onChange={handleChange}
                            value={formValues.ubigeo_cliente}
                            disabled={!provinciaSeleccionada}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                          >
                            <option className="bg-gray-200">
                              Seleccionar Distrito
                            </option>
                            {distritos.map((distrito) => (
                              <option
                                className="bg-gray-200"
                                key={distrito.id}
                                value={distrito.ubigeo}
                              >
                                {distrito.nombre_dist}
                              </option>
                            ))}
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Distrito *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="direccion_cliente"
                            id="direccion_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.direccion_cliente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Direccion *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="referencias_cliente"
                            id="referencias_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.referencias_cliente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Referencias *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="contacto_cliente"
                            id="contacto_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.contacto_cliente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Contacto *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="telefono_cliente"
                            id="telefono_cliente"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            pattern="^[0-9]+$"
                            maxLength={9}
                            onChange={handleChange}
                            value={formValues.telefono_cliente}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="email"
                            name="email_cliente"
                            id="email_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.email_cliente}
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
                            name="area_cliente"
                            id="area_cliente"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.area_cliente}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Area
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

export default ModalEditarCliente;
