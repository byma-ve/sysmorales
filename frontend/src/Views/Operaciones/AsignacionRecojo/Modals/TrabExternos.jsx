import React, { useState, useEffect } from "react";
import SearchProveedor from "../Components/SearchProveedor";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    maxHeight: "23px",
    minHeight: "18px",
    height: "18px",
    fontSize: "12px",
    borderRadius: "5px",
    backgroundColor: "transparent",
    border: "none",
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
    padding: "4px 12px",
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "0px 20px 1px 1px",
    marginTop: "0px",
    marginTop: "-10px",
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    //  display: "none", Oculta el indicador
    marginTop: "-10px",
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none", // Oculta la barrita al lado del indicador
  }),
};

function TrabExternos({ formValues, handleChange }) {
  // Proveedores / Select
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresEncontrar, setProveedoresEncontrar] = useState([]);
  const [tipoProveedor, setTipoProveedor] = useState("");
  const [tipoServicio, setTipoServicio] = useState("");

  useEffect(() => {
    // Obtener proveedores al cargar el componente
    fetch(
      "https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_proveedores.php"
    )
      .then((response) => response.json())
      .then((data) => {
        const transformedDepartamentos = data.map((proveedor) => ({
          value: proveedor.id,
          label: proveedor.razon_social_proveedor,
        }));
        setProveedores(transformedDepartamentos);
        setProveedoresEncontrar(data)
      })
      .catch((error) => console.error("Error fetching proveedores:", error));
  }, []);

  useEffect(() => {
    if (formValues.id_proveedor_recojo) {
      const selected = proveedoresEncontrar.find(
        (p) => p.id === formValues.id_proveedor_recojo
      );
      if (selected) {
        fetch(
          `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Proveedor/obtener_datos_proveedor.php?id=${selected.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            setTipoProveedor(data.tipo_proveedor);
            setTipoServicio(data.tipo_servicio_proveedor);
          })
          .catch((error) =>
            console.error("Error fetching datos del proveedor:", error)
          );
      }
    } else {
      setTipoProveedor("");
      setTipoServicio("");
    }
  }, [formValues.id_proveedor_recojo, proveedoresEncontrar]);

  return (
    <>
      {/* DATOS DEl PROVEEDOR */}
      <form className="mb-1 text-black">
        <div className="grid grid-cols-2   px-4  mr-2  gap-2 mb-2">
          <h1 className="text-black text-sm  ">Datos Trabajadores Externos:</h1>
        </div>
        <div className="grid grid-cols-4 pl-5 gap-0">
          <div className=" ">
            <label className=" text-xs ">Tipo Provedor:</label>
          </div>
          <div className="ml-[-65px]">
            <input
              type="text"
              id="tipo-prov-externo"
              readOnly
              value={tipoProveedor}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">Proveedor:</label>
          </div>
          <div className="ml-[-85px] ">
            {/* <SearchProveedor
              proveedores={proveedores}
              setSelectedProveedor={(proveedor) => {
                setSelectedProveedor(proveedor);
                handleChange({
                  target: {
                    name: "id_proveedor_recojo",
                    value: proveedor ? proveedor.id : "",
                  },
                });
              }}
              selectedProveedorId={formValues.id_proveedor_recojo}
            /> */}
            <Select
              styles={customStyles}
              options={proveedores}
              value={
                formValues.id_proveedor_recojo
                  ? proveedores.find(
                      (option) =>
                        option.value === formValues.id_proveedor_recojo
                    )
                  : null
              }
              onChange={(proveedor) => {
                handleChange({
                  target: {
                    name: "id_proveedor_recojo",
                    value: proveedor ? proveedor.value : "",
                  },
                });
              }}
              placeholder="Seleccione un proveedor"
              className="w-[90%] text-xs bg-gray-100  mt-1 h-[18px] rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">Tipo Servicio:</label>
          </div>
          <div className="ml-[-65px]">
            <input
              type="text"
              id="tipo-serv-externo"
              readOnly
              value={tipoServicio}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
        </div>
      </form>
      {/* DATOS DEl CONDUCTOR */}
      <form className="mb-1 py-2">
        <div className="grid grid-cols-2   px-5  mr-2  gap-2 mb-2">
          <label className=" text-sm ">Datos Trabajadores Externos:</label>
        </div>
        <div className="grid grid-cols-4 pl-5 gap-0">
          <div className="">
            <label className=" text-xs">DNI Conductor:</label>
          </div>
          <div className="ml-[-65px] m">
            <input
              type="text"
              name="dni_conductor_recojo"
              maxLength={11}
              id="dni_conductor_recojo"
              value={formValues.dni_conductor_recojo}
              onChange={handleChange}
              onInput={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">DNI Auxiliar:</label>
          </div>
          <div className="ml-[-85px]">
            <input
              type="text"
              value={formValues.dni_auxiliar_recojo}
              id="dni_auxiliar_recojo"
              name="dni_auxiliar_recojo"
              maxLength={11}
              onChange={handleChange}
              onInput={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">Conductor:</label>
          </div>
          <div className="ml-[-65px]">
            <input
              type="text"
              name="nombre_conductor_recojo"
              id="nombre_conductor_recojo"
              onChange={handleChange}
              value={formValues.nombre_conductor_recojo}
              onInput={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
          <div className="">
            <label className=" text-xs">Auxiliar:</label>
          </div>
          <div className="ml-[-85px]">
            <input
              type="text"
              id="nombre_auxiliar_recojo"
              name="nombre_auxiliar_recojo"
              onChange={handleChange}
              value={formValues.nombre_auxiliar_recojo}
              placeholder=""
              onInput={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              className="uppercase w-[90%] text-xs bg-gray-100 px-1   rounded-sm border  focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default TrabExternos;
