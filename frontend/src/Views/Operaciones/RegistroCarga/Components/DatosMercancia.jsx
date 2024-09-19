export const DatosMercancia = ({
  metrosCubicos,
  pesoVolumen,
  datosRegistro,
  formValues,
  handleChange,
  handleCantMercChange,
  handlePesoMercChange,
  handleLargoChange,
  handleAnchoChange,
  handleAltoChange,
}) => {
  return (
    <>
      <div className="DatosMercancia">
        <div className="side-titulo ">
          <h1 className="uppercase font-semibold text-white py-2  px-4 mb-2 bg-blue-400 ">
            Datos Mercancia
          </h1>
        </div>
        <div className="section-crm px-4 pb-4 ">
          <div className="card-container">
            <form className="grid grid-cols-[1fr,2fr,1fr,2fr] gap-y-2  ">
              <div className=" ">
                <label
                  htmlFor="tipo-envio"
                  className="text-gray-600 font-semibold text-sm"
                >
                  T-Movimiento:
                </label>
              </div>
              <div className="">
                <input
                  readOnly
                  value={
                    datosRegistro.tipo_envio ? datosRegistro.tipo_envio.toUpperCase() : ""
                  }
                  type="text"
                  id="tipo-envio"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className=" ">
                <label
                  htmlFor="tipo-logistica"
                  className="text-gray-600 font-semibold text-sm"
                >
                  T-Logistica:
                </label>
              </div>
              <div className="">
                <input
                  readOnly
                  type="text"
                  value={
                    datosRegistro.tipo_logistica
                      ? datosRegistro.tipo_logistica.toUpperCase()
                      : ""
                  }
                  id="tipo-logistica"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Content-Merc"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Conten Merc.:
                </label>
              </div>
              <div className="">
                <input
                  readOnly
                  type="text"
                  id="Content-Merc"
                  value={
                    datosRegistro.contenido_mercancia
                      ? datosRegistro.contenido_mercancia
                      : ""
                  }
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Cantidad-Merc"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Cantidad Merc.:
                </label>
              </div>
              <div className="">
                <input
                  type=""
                  id="cantidad_mercancia"
                  name="cantidad_mercancia"
                  value={formValues.cantidad_mercancia}
                  onChange={(e) => {
                    handleChange(e);
                    handleCantMercChange(e);
                  }}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Peso-Merc"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Peso Merc.:
                </label>
              </div>
              <div className="">
                <input
                  type=""
                  id="peso_mercancia"
                  name="peso_mercancia"
                  step="0.0001"
                  value={formValues.peso_mercancia}
                  onChange={(e) => {
                    handleChange(e);
                    handlePesoMercChange(e);
                  }}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Peso-Vol"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Peso Vol.:
                </label>
              </div>
              <div className="  flex w-[90%] ">
                <input
                  type=""
                  id="largo"
                  name="largo"
                  placeholder="Largo"
                  step="0.0001"
                  value={formValues.largo}
                  onChange={(e) => {
                    handleChange(e);
                    handleLargoChange(e);
                  }}
                  className="w-[50%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
                <input
                  type=""
                  id="ancho"
                  name="ancho"
                  placeholder="Ancho"
                  step="0.0001"
                  value={formValues.ancho}
                  onChange={(e) => {
                    handleChange(e);
                    handleAnchoChange(e);
                  }}
                  className="w-[50%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
                <input
                  type=""
                  id="alto"
                  placeholder="Alto"
                  step="0.0001"
                  name="alto"
                  value={formValues.alto}
                  onChange={(e) => {
                    handleChange(e);
                    handleAltoChange(e);
                  }}
                  className="w-[50%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
                <input
                  type="text"
                  onChange={handleChange}
                  id="total_peso_volumen"
                  placeholder="Total"
                  name="total_peso_volumen"
                  readOnly
                  value={pesoVolumen}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>

              <div className="">
                <label
                  htmlFor="Metros-Cubicos"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Metros Cubicos:
                </label>
              </div>
              <div className="">
                <input
                  readOnly
                  type="text"
                  onChange={handleChange}
                  id="Metros-Cubicos"
                  value={metrosCubicos}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="Valor-Merc"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Valor Mercanc.:
                </label>
              </div>
              <div className="">
                <input
                  type=""
                  id="valor_mercancia"
                  name="valor_mercancia"
                  value={formValues.valor_mercancia}
                  onChange={handleChange}
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
