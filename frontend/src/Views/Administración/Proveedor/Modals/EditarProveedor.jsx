import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import SearchVendedor from "../Components/SearchVendedor";
import Select from "react-select";
function ModalEditarProveedor({
  modalEditar,
  setModalEditar,
  selectedProveedorData,
  actualizarTabla,
}) {
  const ocultarModal2 = () => {
    setModalEditar(false);
  };

  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState({
    id: "",
    dni_proveedor: "",
    razon_social_proveedor: "",
    representante_proveedor: "",
    clave_proveedor: "",
    tipo_proveedor: "",
    tipo_servicio_proveedor: "",
    ubigeo_proveedor: "",
    direccion_proveedor: "",
    referencias_proveedor: "",
    contacto_proveedor: "",
    telefono_proveedor: "",
    email_proveedor: "",
  });
  const [imagenProveedor, setImagenProveedor] = useState(null);

  useEffect(() => {
    setFormValues({
      id: selectedProveedorData?.id || "",
      dni_proveedor: selectedProveedorData?.dni_proveedor || "",
      razon_social_proveedor:
        selectedProveedorData?.razon_social_proveedor || "",
      representante_proveedor:
        selectedProveedorData?.representante_proveedor || "",
      clave_proveedor: selectedProveedorData?.clave_proveedor || "",
      tipo_proveedor: selectedProveedorData?.tipo_proveedor || "",
      tipo_servicio_proveedor:
        selectedProveedorData?.tipo_servicio_proveedor || "",
      ubigeo_proveedor: selectedProveedorData?.ubigeo_proveedor || "",
      direccion_proveedor: selectedProveedorData?.direccion_proveedor || "",
      referencias_proveedor: selectedProveedorData?.referencias_proveedor || "",
      contacto_proveedor: selectedProveedorData?.contacto_proveedor || "",
      telefono_proveedor: selectedProveedorData?.telefono_proveedor || "",
      email_proveedor: selectedProveedorData?.email_proveedor || "",
    });
    setDepartamentoSeleccionado(selectedProveedorData?.departamento_id || "");
    setProvinciaSeleccionada(selectedProveedorData?.provincia_id || "");
  }, [selectedProveedorData, modalEditar]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setImagenProveedor(file);
    } else {
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

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

  //Mandar Datos A la API

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("id", formValues.id);
    formDataWithImage.append("dni_proveedor", formValues.dni_proveedor);
    formDataWithImage.append(
      "razon_social_proveedor",
      formValues.razon_social_proveedor
    );
    formDataWithImage.append(
      "representante_proveedor",
      formValues.representante_proveedor
    );
    formDataWithImage.append("clave_proveedor", formValues.clave_proveedor);
    formDataWithImage.append("tipo_proveedor", formValues.tipo_proveedor);
    formDataWithImage.append(
      "tipo_servicio_proveedor",
      formValues.tipo_servicio_proveedor
    );
    formDataWithImage.append("ubigeo_proveedor", formValues.ubigeo_proveedor);
    formDataWithImage.append(
      "direccion_proveedor",
      formValues.direccion_proveedor
    );
    formDataWithImage.append(
      "referencias_proveedor",
      formValues.referencias_proveedor
    );
    formDataWithImage.append(
      "contacto_proveedor",
      formValues.contacto_proveedor
    );
    formDataWithImage.append(
      "telefono_proveedor",
      formValues.telefono_proveedor
    );
    formDataWithImage.append("email_proveedor", formValues.email_proveedor);

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/actualizar_proveedor.php",
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
      console.error("Error al realizar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Hubo un problema de red al intentar actualizar los datos.",
      });
    }
  };
  const options = [
    { value: "", label: " Elegir Tipo Servicio" },
    { value: "terrestre", label: "Terrestre" },
    { value: "aereo", label: "Aereo" },
  ];
  const options2 = [
    { value: "", label: " Elegir Tipo Proveedor" },
    { value: "agente", label: "Agente" },
    { value: "transportista", label: " Transportista" },
  ];

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

  const handleSelectChangeTipoServicio = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      tipo_servicio_proveedor: value,
    }));
  };

  const handleSelectChangeTipoProveedor = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      tipo_proveedor: value,
    }));
  };
  return (
    <>
      <div
        className={`side-panel-container ${
          modalEditar ? "visible" : "invisible"
        } fixed pointer-events-auto left-0 top-0 right-0 h-full bg-[rgba(0,0,0,0.4)] z-10`}
      >
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
                    <h1 className="side-txt">Editar Proveedor</h1>
                  </div>
                </div>
                <div>
                  <div className="section-crm px-6">
                    <div className="card-container">
                      <form
                        className="text-black"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        <div className="relative z-0 w-full mb-6 group ">
                          <input
                            type="text"
                            name="dni_proveedor"
                            id="dni_proveedor"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            disabled
                            pattern="^[0-9]+$"
                            maxLength={11}
                            value={formValues.dni_proveedor}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            DNI *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="text"
                            name="razon_social_proveedor"
                            id="razon_social_proveedor"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.razon_social_proveedor}
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
                            name="representante_proveedor"
                            id="representante_proveedor"
                            onChange={handleChange}
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.representante_proveedor}
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
                            name="clave_proveedor"
                            id="clave_proveedor"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.clave_proveedor}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Clave *
                          </label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="tipo_proveedor"
                            id="tipo_proveedor"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            value={formValues.tipo_proveedor}
                            required
                          >
                            <option value="" className="bg-gray-200">
                              Elegir Tipo Proveedor
                            </option>
                            <option value="agente" className="bg-gray-200">
                              Agente
                            </option>
                            <option
                              value="transportista"
                              className="bg-gray-200"
                            >
                              Transportista
                            </option>
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo Proveedor *
                          </label>
                        </div> */}
                        <div className="relative  w-full mb-4 group">
                          <Select
                            placeholder="Tipo Proveedor"
                            styles={customStyles2}
                            options={options2}
                            className="block py-2.5 px-0 w-full text-sm"
                            classNamePrefix="react-select"
                            required
                            name="tipo_proveedor"
                            id="tipo_proveedor"
                            value={
                              formValues.tipo_proveedor
                                ? options2.find(
                                    (option) =>
                                      option.value === formValues.tipo_proveedor
                                  )
                                : null
                            }
                            onChange={handleSelectChangeTipoProveedor}
                          ></Select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo Proveedor *
                          </label>
                        </div>{" "}
                        <div className="relative w-full mb-4 group">
                          <Select
                            placeholder="Tipo Servicio"
                            styles={customStyles2}
                            options={options}
                            className="block py-2.5 px-0 w-full text-sm"
                            classNamePrefix="react-select"
                            required
                            name="tipo_servicio_proveedor"
                            id="tipo_servicio_proveedor"
                            value={
                              formValues.tipo_servicio_proveedor
                                ? options.find(
                                    (option) =>
                                      option.value ===
                                      formValues.tipo_servicio_proveedor
                                  )
                                : null
                            }
                            onChange={handleSelectChangeTipoServicio}
                          ></Select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo Servicio *
                          </label>
                        </div>
                        {/* <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="tipo_servicio_proveedor"
                            id="tipo_servicio_proveedor"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            value={formValues.tipo_servicio_proveedor}
                            required
                          >
                            <option value="" className="bg-gray-200">
                              Elegir Tipo Servicio
                            </option>
                            <option value="terrestre" className="bg-gray-200">
                              Terrestre
                            </option>
                            <option value="aereo" className="bg-gray-200">
                              Aereo
                            </option>
                          </select>
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Tipo Servicio *
                          </label>
                        </div> */}
                        <div className="relative z-0 w-full mb-6 group">
                          <select
                            type="select"
                            name="departamento"
                            id="departamento"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            value={departamentoSeleccionado}
                            onChange={handleDepartamentoChange}
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
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            value={provinciaSeleccionada}
                            onChange={handleProvinciaChange}
                            disabled={!departamentoSeleccionado}
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
                            name="ubigeo_proveedor"
                            id="ubigeo_proveedor"
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            value={formValues.ubigeo_proveedor}
                            disabled={!provinciaSeleccionada}
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
                            name="direccion_proveedor"
                            id="direccion_proveedor"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            onChange={handleChange}
                            required
                            value={formValues.direccion_proveedor}
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
                            name="referencias_proveedor"
                            id="referencias_proveedor"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.referencias_proveedor}
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
                            name="contacto_proveedor"
                            id="contacto_proveedor"
                            onChange={handleChange}
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={formValues.contacto_proveedor}
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
                            name="telefono_proveedor"
                            id="telefono_proveedor"
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            pattern="^[0-9]+$"
                            maxLength={9}
                            value={formValues.telefono_proveedor}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Telefono *
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            type="email"
                            name="email_proveedor"
                            id="email_proveedor"
                            className="uppercase block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none  border-gray-400 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            onChange={handleChange}
                            value={formValues.email_proveedor}
                            onInput={(event) => {
                              event.target.value =
                                event.target.value.toUpperCase();
                            }}
                          />
                          <label className="upp peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6">
                            Email *
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

export default ModalEditarProveedor;
