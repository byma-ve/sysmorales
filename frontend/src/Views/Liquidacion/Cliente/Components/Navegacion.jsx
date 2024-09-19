import { Link } from "react-router-dom";

function Navegacion() {
  return (
    <>
      <div className="cont-navbar relative bg-white rounded-2xl h-[60px] z-0">
        <nav className="navbar w-full h-full flex justify-around text-black p-4 text-center">
          <Link
            to="/home-clientes"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline m-[0_5px] transition-all hover:text-[#1058d0] "
          >
            Cliente
          </Link>
          <Link
            to="/home-agente"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline m-[0_5px] transition-all hover:text-[#1058d0] "
          >
            Agente
          </Link>
          <Link
            to="/home-transporte"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline m-[0_5px] transition-all hover:text-[#1058d0] "
          >
            Transportistas
          </Link>
          <Link
            to="/home-vendedor"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline m-[0_5px] transition-all hover:text-[#1058d0] "
          >
            Vendedor
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Navegacion;
