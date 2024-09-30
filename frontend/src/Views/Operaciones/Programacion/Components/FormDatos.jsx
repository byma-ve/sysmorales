import { useState, useEffect } from "react";
import Select from "react-select";

function FormDatos({
  formData,
  setFormData,
  programaciones,
  cargarSelect,
  resetForm,
  clickEditar,
  datosProgramacion,
  setClickEditar,
  isButtonDisabled,
  optionsGuias,
  selectedValue,
  setSelectedValue,
}) {
  // DEPARTAMENTO - PROVINCIA - DISTRITO
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [distritoSeleccionada, setDistritoSeleccionada] = useState("");

  useEffect(() => {
    // Obtener departamentos
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=departamentos"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedDepartamentos = data.map((departamento) => ({
          value: departamento.id,
          label: departamento.nombre_dep,
        }));
        setDepartamentos(transformedDepartamentos);
      })
      .catch((error) => console.error("Error fetching departamentos:", error));
  }, []);

  useEffect(() => {
    if (departamentoSeleccionado) {
      // Obtener provincias por departamento
      fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Ubigeo/select_ubigeo.php?action=provincias&id=${departamentoSeleccionado}`
      )
        .then((response) => response.json())
        .then((data) => {
          const transformedDepartamentos = data.map((provincia) => ({
            value: provincia.id,
            label: provincia.nombre_prov,
          }));
          setProvincias(transformedDepartamentos);
        })
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
        .then((data) => {
          const transformedDepartamentos = data.map((provincia) => ({
            value: provincia.ubigeo,
            label: provincia.nombre_dist,
          }));
          setDistritos(transformedDepartamentos);
        })
        .catch((error) => console.error("Error fetching distritos:", error));
    }
  }, [provinciaSeleccionada]);

  const handleDepartamentoChange = (event) => {
    setDepartamentoSeleccionado(event.target.value);
    setProvinciaSeleccionada("");
    setDistritoSeleccionada("");
    setDistritos([]);
    setFormData({
      ...formData,
      ubigeo_programacion: "",
    });
  };

  const handleProvinciaChange = (event) => {
    setProvinciaSeleccionada(event.target.value);
    setDistritoSeleccionada("");
    setFormData({
      ...formData,
      ubigeo_programacion: "",
    });
  };

  const handleDistritoChange = (event) => {
    const distritoSeleccionado = event.target.value;
    setDistritoSeleccionada(distritoSeleccionado);
  };

  // DEPARTAMENTO - PROVINCIA - DISTRITO

  const [seleccionOrdenServicio, setSeleccionOrdenServicio] = useState(null);
  const [totalesProgramacion, setTotalesProgramacion] = useState(null);

  const cargarTotales = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/totalesProgramacion.php?id_orden_servicio=${value}`
      );
      const data = await response.json();
      setTotalesProgramacion(data);
    } catch (error) {
      console.error("Error cargar totales:", error);
    }
  };

  useEffect(() => {
    cargarSelect();
  }, []);

  useEffect(() => {
    setTotalesProgramacion(null);
    if (seleccionOrdenServicio) {
      cargarTotales(seleccionOrdenServicio);
    }
  }, [seleccionOrdenServicio]);

  useEffect(() => {
    if (totalesProgramacion) {
      setFormData({
        ...formData,
        id_cliente: totalesProgramacion.id_cliente,
        peso_mercancia_programacion: totalesProgramacion.total_peso_mercancia,
        cantidad_bultos_programacion: totalesProgramacion.total_bultos,
        metros_cubicos_programacion: totalesProgramacion.total_metros_cubicos,
        peso_volumen_programacion: totalesProgramacion.total_peso_volumen,
      });
    }
  }, [totalesProgramacion]);

  const handleInputChange = (event) => {
    console.log(formData);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    setFormData({
      ...formData,
      id_orden_servicio: selectedOption ? selectedOption.value : "",
      ubigeo_programacion: "",
    });
  };

  useEffect(() => {
    setTotalesProgramacion(null);
    setDepartamentoSeleccionado(0);
    setProvinciaSeleccionada(0);
    setDistritoSeleccionada(0);
  }, [resetForm]);

  useEffect(() => {
    if (formData.id_orden_servicio) {
      setDepartamentoSeleccionado(formData.departamento_id);
      setProvinciaSeleccionada(formData.provincia_id);
      setDistritoSeleccionada(formData.ubigeo_programacion)
      cargarTotales(formData.id_orden_servicio);
      setClickEditar(false);
    }
  }, [clickEditar, formData.id_orden_servicio]);

  useEffect(() => {
    if (clickEditar && datosProgramacion) {
      setFormData({
        ...formData,
        id_orden_servicio: datosProgramacion.id_orden_servicio,
        id_cliente: datosProgramacion.id_cliente_programacion,
        area_programacion: datosProgramacion.area_programacion,
        correo_programacion: datosProgramacion.correo_programacion,
        descripcion_mercancia_programacion:
          datosProgramacion.descripcion_mercancia_programacion,
        cantidad_bultos_programacion:
          datosProgramacion.cantidad_bultos_programacion,
        ubigeo_programacion: datosProgramacion.ubigeo_programacion,
        peso_mercancia_programacion:
          datosProgramacion.peso_mercancia_programacion,
        direccion_programacion: datosProgramacion.direccion_programacion,
        peso_volumen_programacion: datosProgramacion.peso_volumen_programacion,
        referencias_programacion: datosProgramacion.referencias_programacion,
        metros_cubicos_programacion:
          datosProgramacion.metros_cubicos_programacion,
        contacto_programacion: datosProgramacion.contacto_programacion,
        fecha_programacion: datosProgramacion.fecha_programacion,
        telefono_programacion: datosProgramacion.telefono_programacion,
        hora_programacion: datosProgramacion.hora_programacion,
        id_creador: localStorage.getItem("id_usuario"),
        departamento_id: datosProgramacion.departamento_id,
        provincia_id: datosProgramacion.provincia_id,
      });
    }
  }, [clickEditar, datosProgramacion, setFormData]);

  // Obtener la fecha actual en el formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    return `${fechaActual.getFullYear()}-${mes}-${dia}`;
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      maxHeight: "23px",
      minHeight: "20px",
      height: "2px",
      fontSize: "12px",
      borderRadius: "5px",
      backgroundColor: "transparent",
      border: "none",
      marginTop: "0",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
      fontSize: "14px",
      margin: "6px 0",
      padding: "2px 0px",
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: "5px",
      padding: "4px 12px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 20px 1px 8px",
      marginTop: "0px",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta el indicador
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta la barrita al lado del indicador
    }),
  };

  const customStyles3 = {
    control: (provided, state) => ({
      ...provided,
      maxHeight: "23px",
      minHeight: "20px",
      height: "2px",
      fontSize: "12px",
      borderRadius: "5px",
      backgroundColor: "transparent",
      border: "none",
      marginTop: "0",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "120px",
      overflowY: "auto",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "5px",
      fontSize: "12px",
      margin: "6px 0",
      padding: "2px 0px",
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: "5px",
      padding: "2px 4px",
      maxHeight: "20px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 20px 1px 2px",
      marginTop: "-2px",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta el indicador
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta la barrita al lado del indicador
    }),
  };
  const handleChangePrueba = (selectedOption) => {
    setSeleccionOrdenServicio(selectedOption.value);
    setSelectedValue(selectedOption);
    handleSelectChange(selectedOption);
    
  };
  return (
    <>
      <div className="Contenedores rounded-xl mr-2 bg-white ">
        <div className="grid">
          <div className="DatosRecojo mb-2 ">
            <div className="side-titulo ">
              <h1 className="uppercase font-semibold text-white py-2 px-3 mb-2  bg-blue-400 rounded-t-xl  ">
                Datos para el Recojo
              </h1>
            </div>
            <div className="section-crm ">
              <div className="card-container">
                <form className="mb-2" key={resetForm}>
                  <div className="grid grid-cols-4 px-5  gap-2 ">
                    <div className="">
                      <label
                        htmlFor="seleccionar-guia"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Guía Madre:
                      </label>
                    </div>
                    <div className="w-[90%]  mt-[6px] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%]   text-gray-600 font-semibold   text-xs -md  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md ">
                      <Select
                        value={selectedValue} // Agregar la propiedad value
                        name="id_orden_servicio"
                        id="id_orden_servicio"
                        isDisabled={isButtonDisabled}
                        options={optionsGuias}
                        required
                        styles={customStyles}
                        placeholder="Elegir guia madre"
                        onChange={handleChangePrueba}
                        className="react-select-container border  bg-gray-100  rounded-sm focus:outline-none focus:ring-0  focus:border-blue-500 focus:shadow-md"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="cliente"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Cliente:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="razon_social_cliente"
                        name="razon_social_cliente"
                        readOnly
                        value={
                          totalesProgramacion &&
                          totalesProgramacion.razon_social_cliente
                            ? totalesProgramacion.razon_social_cliente
                            : ""
                        }
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="area"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Área:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="area_programacion"
                        name="area_programacion"
                        required
                        value={formData.area_programacion}
                        onChange={handleInputChange}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="correo"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Correo:
                      </label>
                    </div>
                    <div>
                      <input
                        type="email"
                        id="correo_programacion"
                        name="correo_programacion"
                        required
                        value={formData.correo_programacion}
                        onChange={handleInputChange}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="departamento"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Departamento:
                      </label>
                    </div>
                    <div>
                      <div className="w-[90%]  mt-[3px] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%]   text-gray-600  text-xs -md  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md  border">
                        <Select
                          styles={customStyles3}
                          className="text-xs text-start w-full "
                          placeholder="Elegir Departamento"
                          options={departamentos}
                          onChange={(selectedOption) =>
                            handleDepartamentoChange({
                              target: {
                                name: "departamento",
                                value: selectedOption.value,
                              },
                            })
                          }
                          required
                          value={
                            departamentoSeleccionado
                              ? departamentos.find(
                                  (option) =>
                                    option.value === departamentoSeleccionado
                                )
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="descripMercancia"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Descrip Mercancía:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="descripcion_mercancia_programacion"
                        name="descripcion_mercancia_programacion"
                        required
                        value={formData.descripcion_mercancia_programacion}
                        onChange={handleInputChange}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="provincia"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Provincia:
                      </label>
                    </div>
                    <div>
                      {/* <select
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                        onChange={handleProvinciaChange}
                        disabled={!departamentoSeleccionado}
                        name="provincia"
                        value={provinciaSeleccionada}
                        id="provincia"
                        required
                      >
                        <option>Elegir Provincia</option>
                        {provincias.map((provincia) => (
                          <option key={provincia.id} value={provincia.id}>
                            {provincia.nombre_prov}
                          </option>
                        ))}
                      </select> */}
                      <div className="w-[90%]  z-10 mt-[3px] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%]   text-gray-600  text-xs -md  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md  border">
                        <Select
                          styles={customStyles3}
                          options={provincias}
                          placeholder="Elegir Provincia"
                          onChange={(selectedOption) =>
                            handleProvinciaChange({
                              target: {
                                name: "provincia",
                                value: selectedOption.value,
                              },
                            })
                          }
                          name="provincia"
                          id="provincia"
                          isDisabled={!departamentoSeleccionado}
                          className="text-xs text-start w-full "
                          value={
                            provinciaSeleccionada
                              ? provincias.find(
                                  (option) =>
                                    option.value === provinciaSeleccionada
                                )
                              : null
                          }
                          required
                        ></Select>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="cantBultos"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Cant Bultos:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="cantidad_bultos_programacion"
                        name="cantidad_bultos_programacion"
                        readOnly
                        value={
                          totalesProgramacion &&
                          totalesProgramacion.total_bultos
                            ? totalesProgramacion.total_bultos
                            : ""
                        }
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="distrito"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Distrito:
                      </label>
                    </div>
                    <div>
                      {/* <select
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                        name="ubigeo_programacion"
                        id="ubigeo_programacion"
                        onChange={handleInputChange}
                        value={formData.ubigeo_programacion}
                        disabled={!provinciaSeleccionada}
                        required
                      >
                        <option>Elegir Distrito</option>
                        {distritos.map((distrito) => (
                          <option key={distrito.id} value={distrito.ubigeo}>
                            {distrito.nombre_dist}
                          </option>
                        ))}
                      </select> */}
                      <div className="w-[90%]  z-10 mt-[3px] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%]   text-gray-600  text-xs -md  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md  border">
                        <Select
                          name="ubigeo_programacion"
                          id="ubigeo_programacion"
                          styles={customStyles3}
                          className="text-xs text-start w-full "
                          isDisabled={!provinciaSeleccionada}
                          options={distritos}
                          placeholder="Elegir Distrito"
                          onChange={(selectedOption) => {
                            const event = {
                              target: {
                                name: "ubigeo_programacion",
                                value: selectedOption.value,
                              },
                            };
                            handleInputChange(event);
                            handleDistritoChange(event);
                          }}
                          value={
                            distritoSeleccionada
                              ? distritos.find(
                                  (option) =>
                                    option.value === distritoSeleccionada
                                )
                              : null
                          }
                          required
                        ></Select>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="pesoMercancia"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Peso - Mercancía:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="peso_mercancia_programacion"
                        name="peso_mercancia_programacion"
                        readOnly
                        value={
                          totalesProgramacion &&
                          totalesProgramacion.total_peso_mercancia
                            ? totalesProgramacion.total_peso_mercancia
                            : ""
                        }
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="direccionRecojo"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Dirección - Recojo:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="direccion_programacion"
                        name="direccion_programacion"
                        required
                        onChange={handleInputChange}
                        value={formData.direccion_programacion}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="pesoVolumen"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Peso Volumen:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="peso_volumen_programacion"
                        name="peso_volumen_programacion"
                        readOnly
                        value={
                          totalesProgramacion &&
                          totalesProgramacion.total_peso_volumen
                            ? totalesProgramacion.total_peso_volumen
                            : ""
                        }
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="referencias"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Referencias:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="referencias_programacion"
                        name="referencias_programacion"
                        required
                        value={formData.referencias_programacion}
                        onChange={handleInputChange}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="metrosCubicos"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Metros Cúbicos:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="metros_cubicos_programacion"
                        name="metros_cubicos_programacion"
                        readOnly
                        value={
                          totalesProgramacion &&
                          totalesProgramacion.total_metros_cubicos
                            ? totalesProgramacion.total_metros_cubicos
                            : ""
                        }
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="contactoRecojo"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Contacto - Recojo:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="contacto_programacion"
                        name="contacto_programacion"
                        value={formData.contacto_programacion}
                        required
                        onChange={handleInputChange}
                        onInput={(event) => {
                          event.target.value = event.target.value.toUpperCase();
                        }}
                        className="uppercase w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="fechaRecojo"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Fecha - Recojo:
                      </label>
                    </div>
                    <div>
                      <input
                        type="date"
                        id="fecha_programacion"
                        name="fecha_programacion"
                        required
                        value={formData.fecha_programacion}
                        onChange={handleInputChange}
                        min={obtenerFechaActual()}
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="telefono"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Teléfono:
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="telefono_programacion"
                        required
                        name="telefono_programacion"
                        pattern="^[0-9]+$"
                        maxLength={9}
                        value={formData.telefono_programacion}
                        onChange={handleInputChange}
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="horaRecojo"
                        className="text-gray-600 text-sm font-semibold"
                      >
                        Hora - Recojo:
                      </label>
                    </div>
                    <div>
                      <input
                        type="time"
                        id="hora_programacion"
                        name="hora_programacion"
                        required
                        value={formData.hora_programacion}
                        onChange={handleInputChange}
                        className="w-[90%] ml-[-5%] lg:ml-[-20%] xl:ml-[-25%] 2xl:ml-[-40%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormDatos;
