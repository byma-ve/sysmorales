import React, { useState, useEffect } from "react";
import MyRoutes from "./Routes/MyRoutes";

function App() {

  // MENSAJITO CUANDO SALES DE LA PAGE
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "¡No te vayas como ella 💔!";
      } else {
        document.title = "Demo";
      }
    };

    // Agregar el listener para el evento de visibilidad
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("login") === "true"
  );

  const [permisos, setPermisos] = useState("");

  useEffect(() => {
    fetch(
      `https://sysdemo.byma-ve.com/BackendApiRest/Permisos/obtenerPermisos.php?dni_usuario=${localStorage.getItem(
        "user"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPermisos(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    const handleUnload = (event) => {
      const user = localStorage.getItem("id_usuario");
      if (user) {
        const url = `https://sysdemo.byma-ve.com/BackendApiRest/Administracion/Usuario/estadoDesconectado.php?id=${encodeURIComponent(
          user
        )}`;
        navigator.sendBeacon(url);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <MyRoutes
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
      permisos={permisos}
    />
  );
}

export default App;
