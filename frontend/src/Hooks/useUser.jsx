import { useEffect, useState } from "react";

export const useUser = () => {
  // Estado para la información del usuario.
  const [userData, setUserData] = useState(null);
  // Estado de la hora
  const [hora, setHora] = useState("");

  // Obtenemos los datos del usuario del localStorage
  const user = localStorage.getItem("user");

  // Obtener la hora actual
  const obtenerHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, "0");
    const minutos = ahora.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  useEffect(() => {
    const fetchData = () => {
      if (user) {
        fetch(
          `https://sistema.transportesmorales-logistik.com/BackendApiRest/Administracion/Usuario/obtener_usuario.php?usuario=${encodeURIComponent(
            user
          )}`
        )
          .then((response) => response.json())
          .then((data) => {
            setUserData(data);
          })
          .catch((error) => {
            console.error("Error al obtener datos del usuario:", error);
          });
      }
    };
    fetchData();
    const intervalo = setInterval(fetchData, 5000);
    return () => clearInterval(intervalo);
  }, [user]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(obtenerHoraActual());
    }, 0);

    return () => clearInterval(intervalo);
  }, []);

  return { userData, hora };
};
