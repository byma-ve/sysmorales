import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Static/Img_Pred/LogoBlanco.webp";
import ImageComponent from "../Dashboard/ImgComponent";
import { usePreload } from "../../Context/UserContext";
import { motion } from "framer-motion";
import FondoT from "../../Static/Img_Pred/Gif.gif";

function Login({ setLoggedIn }) {
  const naviget = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [validated, setValidated] = useState(false);

  const { showPreload, setShowPreload } = usePreload();

  useEffect(() => {
    if (localStorage.getItem("login") === "true") {
      naviget("/dashboard");
    } else {
      localStorage.clear();
    }
  }, [naviget]);

  const loginSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Login/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user,
            pass,
          }),
        }
      );
      const data = await response.json();
      if (data.message) {
        const { id_usuario } = data.user;
        setShowPreload(true);
        setTimeout(() => {
          setShowPreload(false);
          setLoggedIn(true);
          localStorage.setItem("login", true);
          localStorage.setItem("user", user);
          localStorage.setItem("id_usuario", id_usuario);
          setMsg(data.message);
          naviget("/dashboard");
        }, 5000); // Tiempo de duración de la precarga (2 segundos)
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Error al iniciar sesión");
    }
  };
  if (showPreload) {
    return <ImageComponent src={FondoT} />;
  }
  return (
    <>
      <div
        className="bg-gradient-to-bl relative  from-gray-800 via-gray-700 to-gray-800   
        "
      >
        <img src={Logo} alt="" className="absolute  w-[154px]  ml-[70px] m-8" />
        <div className="  h-[100vh] cont-logo mx-auto w-[18rem] grid content-center   ">
          <motion.div
            initial={{ y: "35%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 130 }}
          >
            <div className="flex justify-center  ">
              <h1 className="text-white text-3xl font-bold">Bienvenidos</h1>
            </div>
            <div className="mt-12  ">
              <form
                noValidate
                validated={validated.toString()}
                onSubmit={loginSubmit}
                className="  "
              >
                <div>
                  {error !== "" ? (
                    <p style={{ color: "#842029" }}>
                      <b>{error}</b>
                    </p>
                  ) : (
                    <p style={{ color: "#badbcc" }}>
                      <b>{msg}</b>
                    </p>
                  )}
                </div>

                <div className="">
                  <label className="flex  mb-2 text-sm font-medium text-gray-400 ">
                    Dni/RUC
                  </label>
                  <input
                    className="bg-transparent border-b border-gray-500 text-white text-sm     w-full p-3 outline-none"
                    type="text"
                    required
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                </div>

                <div className="mt-5">
                  <label className="flex  mb-2 text-sm font-medium text-gray-400 ">
                    Contraseña
                  </label>
                  <input
                    className="bg-transparent border-b border-gray-500 text-white text-sm     w-full p-3 outline-none"
                    type="password"
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className=" mt-5 rounded-lg w-full border-solid border-gray-500 bg-gray-500 hover:bg-gray-600 text-white text-xs p-[12px_45px] uppercase active:scale-95 outline-none"
                >
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Login;
