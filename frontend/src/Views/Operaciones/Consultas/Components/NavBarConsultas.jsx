import { IconoOjito2, IconoComentario } from "../../../../Iconos/Iconos-NavBar";

const NavBarConsultas = ({ informacionInstancia }) => {
  return (
    <>
      <div className="">
        <div className="  relative  overflow-x-auto  bg-[#fff]   ScrollTable rounded-t-2xl ">
          <table className="w-[100%] table-fixed   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            <tbody className="text-left text-[#535c69] whitespace-nowrap block">
              <thead className="bg-blue-400  text-left text-md  border-b border-gray-300 text-white  whitespace-nowrap  ">
                <tr className="">
                  <td className="w-[4rem] max-w-[64px]"></td>
                  <td className=" px-8 py-3 font-semibold ">Instancias</td>
                  <td className="  px-8 py-3 ">Estado Mercancia</td>
                  <td className="  px-8 py-3 font-semibold ">Fecha Estado</td>
                  <td className="  px-8 py-3 font-semibold ">Comentario</td>
                  <td className=" px-8 py-3 text-[15px]  font-semibold  ">
                    Imagen
                  </td>
                </tr>
              </thead>

              <tr className="border-b bg-white  border-gray-300 hover:bg-gray-300 ">
                <td className="px-8 py-4  text-[15px] font-semibold      ">
                  <button>
                    <IconoComentario />
                  </button>
                </td>
                <td className="px-8 py-4 w-1/6  text-[15px] font-semibold     ">
                  {informacionInstancia.instancia
                    ? informacionInstancia.instancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-8 py-4 w-1/6  text-[15px] font-semibold     ">
                  {informacionInstancia.estado_mercancia
                    ? informacionInstancia.estado_mercancia.toUpperCase()
                    : ""}
                </td>
                <td className="px-8 py-4 w-1/6  text-[15px] font-semibold     ">
                  {informacionInstancia.fecha_estado
                    ? informacionInstancia.fecha_estado
                    : ""}
                </td>
                <td className="px-8 py-4 w-1/6  text-[15px] font-semibold      ">
                  {/* {informacionInstancia.comentario
                    ? informacionInstancia.comentario.toUpperCase()
                    : ""} */}
                  <button>
                    <IconoComentario />
                  </button>
                </td>
                <td className="px-8 py-4 w-1/6  text-[15px] text-center font-semibold  ">
                  {informacionInstancia?.imagen_1 && (
                    <>
                      <a href={informacionInstancia.imagen_1} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                  {informacionInstancia?.imagen_2 && (
                    <>
                      <a href={informacionInstancia.imagen_2} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                  {informacionInstancia?.imagen_3 && (
                    <>
                      <a href={informacionInstancia.imagen_3} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                  {informacionInstancia?.imagen_4 && (
                    <>
                      <a href={informacionInstancia.imagen_4} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                  {informacionInstancia?.imagen_5 && (
                    <>
                      <a href={informacionInstancia.imagen_5} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                  {informacionInstancia?.imagen_6 && (
                    <>
                      <a href={informacionInstancia.imagen_6} target="_blank">
                        <IconoOjito2 className="mx-1" />
                      </a>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default NavBarConsultas;
