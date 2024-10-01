import React, { useState, useEffect } from "react";
import { IconoEstado } from "../../../Iconos/Iconos-NavBar";
import { Avatar } from "@nextui-org/react";
function PopularProducts() {
  const [datos, setDatos] = useState([]);
  const fetchDatos = () => {
    fetch(
      `https://sistema.transportesmorales-logistik.com/BackendApiRest/Dashboard/obtenerConectados.php?id_usuario=${localStorage.getItem(
        "id_usuario"
      )}`
    )
      .then((response) => response.json())
      .then((data) => setDatos(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchDatos();
    const intervalId = setInterval(fetchDatos, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-[20rem] ScrollTableVertical overflow-auto   bg-white p-4 rounded-xl border max-h-[30rem] border-gray-200 ">
      <strong className="text-gray-700 font-medium">Usuarios Activos</strong>
      <div className="mt-4   flex flex-col gap-3 ">
        {datos.map((dato) => (
          <tr
            key={dato.id}
            to={`/product/${dato.id}`}
            className="flex items-start hover:no-underline"
          >
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-full cont-logo">
              <Avatar
                className="w-full h-full object-cover rounded-full "
                src={`https://images.weserv.nl/?url=${dato.foto_usuario}`}
                alt={dato.colaborador_usuario}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {dato.colaborador_usuario.charAt(0).toUpperCase() +
                  dato.colaborador_usuario.slice(1)}
              </p>
              <p className="text-sm text-gray-500">
                {dato.cargo_usuario.charAt(0).toUpperCase() +
                  dato.cargo_usuario.slice(1)}
              </p>
            </div>
            {dato.conectado === "1" ? (
              <IconoEstado className="text-green-600 text-xl" />
            ) : (
              <IconoEstado className="text-gray-600 text-xl" />
            )}
          </tr>
        ))}
      </div>
    </div>
  );
}

export default PopularProducts;
