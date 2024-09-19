export const Documento = ({ handleChange, datosRegistro, formValues }) => {
  return (
    <>
      <div className="Documento ">
        <div className="side-titulo ">
          <h1 className="uppercase font-semibold text-white py-2 px-4 mb-2 bg-blue-400 ">
            Documento
          </h1>
        </div>
        <div className="section-crm px-4 pb-3 ">
          <div className="card-container">
            <form className="grid grid-cols-[1fr,2fr,1fr,2fr]    gap-2 mb-1">
              <div className=" ">
                <label
                  htmlFor="g-transport"
                  className="text-gray-600 font-semibold text-sm"
                >
                  G-Transpor:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={11}
                  onChange={handleChange}
                  value={formValues.guia_transportista}
                  name="guia_transportista"
                  id="guia_transportista"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className=" ">
                <label
                  htmlFor="g-remision"
                  className="text-gray-600 font-semibold text-sm"
                >
                  G-Remision:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={11}
                  onChange={handleChange}
                  value={formValues.guia_remision}
                  id="guia_remision"
                  name="guia_remision"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="doc-adicional-uno"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Nro. Pedido:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={11}
                  onChange={handleChange}
                  value={formValues.documento_1}
                  id="documento_1"
                  name="documento_1"
                  className="w-[90%] pl-1 text-gray-900 font-semibold border rounded text-xs -md h-5 focus:outline-none focus:ring-0  focus:border-blue-500  focus:shadow-md"
                />
              </div>
              <div className="">
                <label
                  htmlFor="doc-adicional-dos"
                  className="text-gray-600 font-semibold text-sm"
                >
                  Doc.Adicional:
                </label>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={11}
                  onChange={handleChange}
                  id="documento_2"
                  name="documento_2"
                  value={formValues.documento_2}
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
