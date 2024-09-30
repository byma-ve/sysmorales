import { useState, useEffect } from "react";
import SearchTransportista from "./SelectBuscador/SearchTransportista";
import SearchConductor from "./SelectBuscador/SearchConductor";
import SearchAuxiliar from "./SelectBuscador/SearchAuxiliar";
import SearchPlaca from "./SelectBuscador/SearchPlaca";
import Select from "react-select";
export const DatosManifiesto = ({
  handleChange,
  fechaActual,
  formDespachoValues,
  selectAuxiliares,
  selectConductores,
  selectTransportistas,
  selectVehiculos,
  handleSelectVehiculo,
  datosVehiculo,
  selectedTransportista,
  handleSelectTransportista,
  distritos,
  provinciaSeleccionada,
  provincias,
  departamentoSeleccionado,
  handleProvinciaChange,
  departamentos,
  handleDepartamentoChange,
  distritoSeleccionada,
  handleDistritoChange,
}) => {
  const [selectedTransportistaState, setSelectedTransportistaState] = useState(
    selectedTransportista
  );

  useEffect(() => {
    const transportistaId = selectedTransportistaState?.id
      ? selectedTransportistaState.id.toString().trim()
      : "";

    handleSelectTransportista({
      target: { value: transportistaId },
    });

    handleChange({
      target: {
        name: "id_transportista_despacho",
        value: transportistaId,
      },
    });
  }, [selectedTransportistaState]);

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
      marginTop: "0px",
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
      marginTop: "-8px",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      // display: "none", // Oculta el indicador
      marginTop: "-6px",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none", // Oculta la barrita al lado del indicador
    }),
  };
  return (
    <>
      <div className="DatosManifiesto mb-2  bg-white rounded-xl mr-2">
        <div className="side-titulo ">
          <h1 className="uppercase font-semibold text-white py-[0.68rem] px-3 mb-2  bg-blue-400 rounded-t-xl  ">
            Datos de Manifiesto
          </h1>
        </div>
        <div className="section-crm ">
          <div className="card-container">
            <form className="mb-2">
              <div className="grid grid-cols-[19%,32%,2%,18%,32%,] px-5  gap-1 ">
                <div className=" ">
                  <label
                    htmlFor="cotizacion"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    N° Manifiesto
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    id="id_num_manifiesto_despacho"
                    name="id_num_manifiesto_despacho"
                    value={"En Proceso"}
                    readOnly
                    className="w-[90%] pl-1 text-gray-600 font-semibold  text-xs  border rounded   h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div></div>
                <div className="">
                  <label
                    htmlFor="direccion"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Departamento
                  </label>
                </div>
                <div className=" w-[90%] ">
                  <Select
                    styles={customStyles3}
                    className="border rounded-sm  mt-1"
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
                <div className="">
                  <label
                    htmlFor="rucDni"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Fecha-Despacho
                  </label>
                </div>
                <div>
                  <input
                    readOnly
                    type="text"
                    id="fecha_creado"
                    onChange={handleChange}
                    value={fechaActual()}
                    className="w-[90%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div></div>
                <div className="">
                  <label
                    htmlFor="contacto"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Provincia
                  </label>
                </div>
                <div>
                  {/* <select
                    name="provincia"
                    id="provincia"
                    value={provinciaSeleccionada}
                    onChange={handleProvinciaChange}
                    disabled={!departamentoSeleccionado}
                    className="w-[90%] pl-1 text-xs h-5  border px-1  rounded-sm   focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option>Elegir Provincia</option>
                    {provincias.map((provincia) => (
                      <option key={provincia.id} value={provincia.id}>
                        {provincia.nombre_prov}
                      </option>
                    ))}
                  </select> */}
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
                    className="border rounded-sm w-[90%] mt-1"
                    value={
                      provinciaSeleccionada
                        ? provincias.find(
                            (option) => option.value === provinciaSeleccionada
                          )
                        : null
                    }
                    required
                  ></Select>
                </div>
                <div className="">
                  <label
                    htmlFor="contacto"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Transportista
                  </label>
                </div>
                <div>
                  {/* <SearchTransportista
                    transportistas={selectTransportistas}
                    selectedTransportista={selectedTransportistaState}
                    setSelectedTransportista={setSelectedTransportistaState}
                    className="w-[90%] pl-1 border px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  /> */}

                  <Select
                    name="id_transportista_despacho"
                    id="id_transportista_despacho"
                    styles={customStyles3}
                    className="border rounded-sm w-[90%] mt-1"
                    placeholder="Elegir Transportista"
                    options={selectTransportistas}
                    onChange={(selectedOption) => {
                      const event = {
                        target: {
                          name: "id_transportista_despacho",
                          value: selectedOption.value,
                        },
                      };
                      handleSelectTransportista(event);
                      handleChange(event);
                    }}
                    value={
                      formDespachoValues.id_transportista_despacho
                        ? selectTransportistas.find(
                            (option) =>
                              option.value ===
                              formDespachoValues.id_transportista_despacho
                          )
                        : null
                    }
                  />
                </div>
                <div></div>
                <div className="">
                  <label
                    htmlFor="departamento"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Distrito
                  </label>
                </div>
                <div>
                  {/* <select
                    id="ubigeo_despacho"
                    name="ubigeo_despacho"
                    onChange={handleChange}
                    value={
                      formDespachoValues.ubigeo_despacho
                        ? formDespachoValues.ubigeo_despacho
                        : ""
                    }
                    disabled={!provinciaSeleccionada}
                    className="w-[90%] pl-1 text-xs h-5 border px-1  rounded-sm   focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option>Elegir Distrito</option>
                    {distritos.map((distrito) => (
                      <option key={distrito.id} value={distrito.ubigeo}>
                        {distrito.nombre_dist}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    name="ubigeo_despacho"
                    id="ubigeo_despacho"
                    styles={customStyles3}
                    className="border rounded-sm w-[90%] mt-1"
                    isDisabled={!provinciaSeleccionada}
                    options={distritos}
                    placeholder="Elegir Distrito"
                    onChange={(selectedOption) => {
                      const event = {
                        target: {
                          name: "ubigeo_despacho",
                          value: selectedOption.value,
                        },
                      };
                      handleChange(event);
                      handleDistritoChange(event);
                    }}
                    value={
                      distritoSeleccionada
                        ? distritos.find(
                            (option) => option.value === distritoSeleccionada
                          )
                        : null
                    }
                    required
                  ></Select>
                </div>

                <div className="">
                  <label
                    htmlFor="departamento"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    G-Transportista
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    id="guia_transportista_despacho"
                    onChange={handleChange}
                    name="guia_transportista_despacho"
                    value={
                      formDespachoValues.guia_transportista_despacho
                        ? formDespachoValues.guia_transportista_despacho
                        : ""
                    }
                    onInput={(event) => {
                      event.target.value = event.target.value.toUpperCase();
                    }}
                    className="uppercase w-[90%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                  />
                </div>
                <div></div>
                <div className="">
                  <label
                    htmlFor="placa"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Placa:
                  </label>
                </div>
                {formDespachoValues.id_transportista_despacho ? (
                  <div>
                    <input
                      type="text"
                      id="placa_despacho"
                      name="placa_despacho"
                      onChange={handleChange}
                      value={
                        formDespachoValues.placa_despacho
                          ? formDespachoValues.placa_despacho
                          : ""
                      }
                      onInput={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                      }}
                      className="uppercase w-[90%] pl-1 border px-1 rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
                    />
                  </div>
                ) : (
                  <div>
                    {/* <SearchPlaca
                      vehiculos={selectVehiculos}
                      selectedVehiculoId={
                        formDespachoValues.id_vehiculo_despacho
                      }
                      setSelectedVehiculo={(vehiculo) => {
                        handleSelectVehiculo({
                          target: { value: vehiculo ? vehiculo.id : "" },
                        });
                        handleChange({
                          target: {
                            name: "id_vehiculo_despacho",
                            value: vehiculo ? vehiculo.id : "",
                          },
                        });
                      }}
                    /> */}
                    <Select
                      name="id_vehiculo_despacho"
                      id="id_vehiculo_despacho"
                      styles={customStyles3}
                      className="border rounded-sm w-[90%] mt-1"
                      placeholder="Elegir Placa"
                      options={selectVehiculos}
                      onChange={(selectedOption) => {
                        const event = {
                          target: {
                            name: "id_vehiculo_despacho",
                            value: selectedOption.value,
                          },
                        };
                        handleSelectVehiculo(event);
                        handleChange(event);
                      }}
                      value={
                        formDespachoValues.id_vehiculo_despacho
                          ? distritos.find(
                              (option) =>
                                option.value ===
                                formDespachoValues.id_vehiculo_despacho
                            )
                          : null
                      }
                    />
                  </div>
                )}

                <div className="">
                  <label
                    htmlFor="conductor"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Conductor:
                  </label>
                </div>
                {formDespachoValues.id_transportista_despacho ? (
                  <div>
                    <input
                      type="text"
                      id="conductor_despacho"
                      onChange={handleChange}
                      value={
                        formDespachoValues.conductor_despacho
                          ? formDespachoValues.conductor_despacho
                          : ""
                      }
                      name="conductor_despacho"
                      onInput={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                      }}
                      className="uppercase w-[90%] pl-1 border px-1 rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
                    />
                  </div>
                ) : (
                  <div>
                    {/* <SearchConductor
                      conductores={selectConductores}
                      selectedConductorId={
                        formDespachoValues.id_conductor_despacho
                      }
                      setSelectedConductor={(conductor) =>
                        handleChange({
                          target: {
                            name: "id_conductor_despacho",
                            value: conductor ? conductor.id : "",
                          },
                        })
                      }
                    /> */}
                    <Select
                      name="id_conductor_despacho"
                      id="id_conductor_despacho"
                      styles={customStyles3}
                      className="border rounded-sm w-[90%] mt-1"
                      placeholder="Elegir Conductor"
                      options={selectConductores}
                      onChange={(selectedOption) =>
                        handleChange({
                          target: {
                            name: "id_conductor_despacho",
                            value: selectedOption.value,
                          },
                        })
                      }
                      value={
                        formDespachoValues.id_conductor_despacho
                          ? distritos.find(
                              (option) =>
                                option.value ===
                                formDespachoValues.id_conductor_despacho
                            )
                          : null
                      }
                    />
                  </div>
                )}
                <div></div>
                <div className="">
                  <label
                    htmlFor="departamento"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    T.Vehículo
                  </label>
                </div>
                {formDespachoValues.id_transportista_despacho ? (
                  <div>
                    <input
                      type="text"
                      id="tipo_vehiculo_despacho"
                      onChange={handleChange}
                      value={
                        formDespachoValues.tipo_vehiculo_despacho
                          ? formDespachoValues.tipo_vehiculo_despacho
                          : ""
                      }
                      name="tipo_vehiculo_despacho"
                      onInput={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                      }}
                      className="uppercase w-[90%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={
                        datosVehiculo.tipo_vehiculo
                          ? datosVehiculo.tipo_vehiculo
                          : ""
                      }
                      readOnly
                      className="w-[90%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                    />
                  </div>
                )}

                <div className="">
                  <label
                    htmlFor="auxiliar"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Auxiliar:
                  </label>
                </div>
                {formDespachoValues.id_transportista_despacho ? (
                  <div>
                    <input
                      type="text"
                      id="auxiliar_despacho"
                      onChange={handleChange}
                      value={
                        formDespachoValues.auxiliar_despacho
                          ? formDespachoValues.auxiliar_despacho
                          : ""
                      }
                      name="auxiliar_despacho"
                      onInput={(event) => {
                        event.target.value = event.target.value.toUpperCase();
                      }}
                      className="uppercase w-[90%] pl-1 border px-1 rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-md"
                    />
                  </div>
                ) : (
                  <div className="">
                    {/* <SearchAuxiliar
                      className="w-[90%] pl-1 border px-1  rounded-sm text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                      auxiliares={selectAuxiliares}
                      selectedAuxiliarId={
                        formDespachoValues.id_auxiliar_despacho
                      }
                      setSelectedAuxiliar={(auxiliar) =>
                        handleChange({
                          target: {
                            name: "id_auxiliar_despacho",
                            value: auxiliar ? auxiliar.id : "",
                          },
                        })
                      }
                    /> */}
                    <Select
                      name="id_auxiliar_despacho"
                      id="id_auxiliar_despacho"
                      styles={customStyles3}
                      className="border rounded-sm w-[90%] mt-1"
                      placeholder="Elegir Auxiliar"
                      options={selectAuxiliares}
                      onChange={(selectedOption) =>
                        handleChange({
                          target: {
                            name: "id_auxiliar_despacho",
                            value: selectedOption.value,
                          },
                        })
                      }
                      value={
                        formDespachoValues.id_auxiliar_despacho
                          ? distritos.find(
                              (option) =>
                                option.value ===
                                formDespachoValues.id_auxiliar_despacho
                            )
                          : null
                      }
                    />
                  </div>
                )}
                <div></div>
                <div className="">
                  <label
                    htmlFor="departamento"
                    className="text-gray-600 font-semibold text-sm"
                  >
                    Cant-Bultos
                  </label>
                </div>
                <div className="flex w-[90%]">
                  <input
                    type="number"
                    id="cantidad_bultos_despacho"
                    name="cantidad_bultos_despacho"
                    onChange={handleChange}
                    value={
                      formDespachoValues.cantidad_bultos_despacho
                        ? formDespachoValues.cantidad_bultos_despacho
                        : ""
                    }
                    className="w-[50%] pl-1 mr-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                    placeholder="Bultos"
                  />
                  <input
                    type="number"
                    id="peso_total_despacho"
                    name="peso_total_despacho"
                    step="0.0001"
                    onChange={handleChange}
                    value={
                      formDespachoValues.peso_total_despacho
                        ? formDespachoValues.peso_total_despacho
                        : ""
                    }
                    className="w-[50%] pl-1 text-gray-600 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                    placeholder="Peso Total"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
