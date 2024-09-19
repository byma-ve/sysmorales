import { DatosTablaCourier } from "../Data/DatosTablaCourier";

export const TablaValorizado = ({ mostrarModal, columnasVisibles }) => {
  const columnas = Object.keys(columnasVisibles);

  return (
    <>
      <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
        <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {courriersFiltrados.length === 0 ? (
            <span className="  text-center flex justify-center mt-3 text-base">
              No se encontraron resultados
            </span>
          ) : (
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="text-left text-md   border-b border-gray-300 text-gray-600 whitespace-nowrap ">
                <tr>
                  <th scope="col" className="text-left w-[4rem]"></th>
                  {columnas.map(
                    (header, index) =>
                      columnasVisibles[header] && (
                        <th
                          key={index}
                          scope="col"
                          className="px-10 py-3 w-1/6"
                        >
                          {header}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              {DatosTablaCourier.map((item, index) => (
                <tr
                  key={index}
                  className="flex bg-[#fff] border-b  border-gray-300 hover:bg-gray-300 cursor-pointer"
                >
                  <td className="w-[4rem] px-6 py-3"></td>
                  {columnas.map(
                    (columna, index) =>
                      columnasVisibles[columna] && (
                        <td key={index} className="px-10 py-4 ">
                          {item[columna]}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="sticky ml-4 flex justify-start font-mono font-medium text  py-6 pr-6 text-gray-400  bg-[#fff] rounded-b-xl">
        <div className="px-10 ">
          <button className="text-base hover:text-[#1058d0] " href="">
            ◄ Anterior
          </button>
        </div>
        <div className="px-10">
          <button className="text-base hover:text-[#1058d0] " href="">
            Siguiente ►
          </button>
        </div>
        <span>1</span>
      </div>
    </>
  );
};
