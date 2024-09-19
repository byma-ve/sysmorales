import { useState, useEffect } from "react";

const ListTop = ({ idCliente, idArea, idYear }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Dashboard/topDestinos.php?id_cliente=${idCliente}&id_area=${idArea}&id_year=${idYear}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, [idCliente, idArea, idYear]);
  return (
    <>
      <div className="flex-col flex-1 max-h-[30rem]">
        <div className=" relative overflow-y-auto  shadow-md sm:rounded-xl max-h-[30rem] ScrollTable  bg-white p-2 rounded-xl border border-gray-200 flex flex-col ">
          <div className="bg-white p-4 font-semibold text-base text-gray-800">
            <h1>Top 10 de Destinos</h1>
          </div>
          <table className=" text-left text-sm  rtl:text-right text-gray-900  ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3">
                  Provincia
                </th>
                <th scope="col" className="px-6 py-3">
                  Distrito
                </th>
                <th scope="col" className="px-6 py-3">
                  Cantidad Guias
                </th>
                <th scope="col" className="px-6 py-3">
                  Analisis
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap ]  ">
              {data.map((destino) => (
                <tr
                  key={destino.UBIGEO}
                  className="bg-white border-b  dark:hover:bg-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {destino.DEPARTAMENTO}
                  </th>
                  <td className="px-6 py-4">{destino.PROVINCIA}</td>
                  <td className="px-6 py-4">{destino.DESTINO}</td>
                  <td className="px-6 py-4">{destino.Income}</td>
                  <td className="pr-10 w-36 ">
                    <div className=" bg-gray-300 rounded-full ">
                      <div
                        className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full w-[${destino.Percentage}%]`}
                      >
                        {destino.Percentage}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListTop;
