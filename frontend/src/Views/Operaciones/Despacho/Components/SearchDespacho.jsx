import { useState, useEffect } from "react";
const SearchDespacho = ({
  titlle,
  btntittle,
  formDespachoValues,
  handleSubmitDespacho,
}) => {
  const [desactivarBotones, setDesactivarBotones] = useState(true);
  useEffect(() => {
    const desactivarBotones =
      (formDespachoValues.auxiliar_despacho !== "" &&
        formDespachoValues.cantidad_bultos_despacho !== "" &&
        formDespachoValues.conductor_despacho !== "" &&
        formDespachoValues.fecha_creado !== "" &&
        formDespachoValues.guia_transportista_despacho !== "" &&
        formDespachoValues.id_creador_despacho !== "" &&
        formDespachoValues.id_transportista_despacho !== "" &&
        formDespachoValues.placa_despacho !== "" &&
        formDespachoValues.peso_total_despacho !== "" &&
        formDespachoValues.tipo_vehiculo_despacho !== "" &&
        formDespachoValues.ubigeo_despacho !== "" &&
        formDespachoValues.id_auxiliar_despacho === "" &&
        formDespachoValues.id_conductor_despacho === "" &&
        formDespachoValues.id_vehiculo_despacho === "") ||
      (formDespachoValues.cantidad_bultos_despacho !== "" &&
        formDespachoValues.fecha_creado !== "" &&
        formDespachoValues.guia_transportista_despacho !== "" &&
        formDespachoValues.id_auxiliar_despacho !== "" &&
        formDespachoValues.id_conductor_despacho !== "" &&
        formDespachoValues.id_creador_despacho !== "" &&
        formDespachoValues.id_vehiculo_despacho !== "" &&
        formDespachoValues.peso_total_despacho !== "" &&
        formDespachoValues.ubigeo_despacho !== "" &&
        formDespachoValues.auxiliar_despacho === "" &&
        formDespachoValues.conductor_despacho === "" &&
        formDespachoValues.id_transportista_despacho === "" &&
        formDespachoValues.placa_despacho === "" &&
        formDespachoValues.tipo_vehiculo_despacho === "");
    setDesactivarBotones(desactivarBotones);
  }, [formDespachoValues]);
  return (
    <>
      <div className="-mt-[8px] text-white  flex justify-between  mb-3 cont-logo ">
        <h1 className="text-3xl  font-semibold">{titlle}</h1>
        <div className="flex  items-center">
          <button
            className={`bg-gradient-to-t from-blue-400 h-10 via-blue-500 to-blue-500 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 text-white  
            px-8 tracking-wide text-[18px] font-semibold  rounded-[10px]     ${
            !(desactivarBotones && desactivarBotones)
              ? "cursor-not-allowed"
              : ""
          }`}
            disabled={!desactivarBotones}
            onClick={handleSubmitDespacho}
          >
            <h1>{btntittle}</h1>
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchDespacho;
