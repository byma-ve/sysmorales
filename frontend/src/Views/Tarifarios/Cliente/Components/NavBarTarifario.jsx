import React from "react";

import { Link } from "react-router-dom";
const NavBarTarifario = () => {
return (
    <>
        
      <div className="cont-navbar relative  mb-4 bg-white rounded-2xl h-[60px] z-0">
        <nav className="navbar w-full h-full flex justify-around text-black p-4 text-center">
          <Link
            to="/tarifario-cliente"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline  transition-all hover:text-[#1058d0] "
          >
                    Tarifario Cliente
          </Link>
          <Link
            to="/tarifario-agente"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline transition-all hover:text-[#1058d0]  "
          >
              Tarifario Agente
          </Link>
          <Link
            to="/tarifario-transportista"
            className="elmnts cursor-pointer relative text-[15px] font-semibold text-black no-underline transition-all hover:text-[#1058d0] "
          >
            Tarifario Transportista
          </Link>
          
        </nav>
      </div>
    </>

);
};

export default NavBarTarifario;
