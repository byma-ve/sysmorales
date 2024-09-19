import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Home from "../../../Layout/Home";
import Encabezado from "./Components/Encabezado";
import FormDatos from "./Components/FormDatos";
import Listado from "./Components/Listado";

function HomeProg() {
  const [selectedValue, setSelectedValue] = useState(null); // Estado para almacenar el valor seleccionado

  const [clickEditar, setClickEditar] = useState(false);

  const [programaciones, setProgramaciones] = useState([]);
  const [optionsGuias, setOptionsGuias] = useState([]);
  const cargarProgramaciones = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/obtenerProgramaciones.php"
      );
      const data = await response.json();
      setProgramaciones(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    cargarProgramaciones();
  }, []);

  const [datosProgramacion, setDatosProgramacion] = useState([]);

  const cargarDatosProgramacion = async (value) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/datosProgramacion.php?id_orden_servicio=${value}`
      );
      const data = await response.json();
      setDatosProgramacion(data);
    } catch (error) {
      console.error("Error cargar datos programacion:", error);
    }
  };

  const [programacionSeleccionada, setProgramacionSeleccionada] =
    useState(null);

  const handleSelectChange = (event) => {
    setProgramacionSeleccionada(event.target.value);
    cargarDatosProgramacion(event.target.value);
  };

  const [ordenesServicio, setOrdenerServicio] = useState([]);

  const cargarSelect = async () => {
    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/obtenerOrdenServicio.php"
      );
      const data = await response.json();
      setOrdenerServicio(data);
      const formattedOptions = data.map((option) => ({
        value: option.id_orden_servicio_validacion,
        label: option.id_orden_servicio_validacion,
      }));
      setOptionsGuias(formattedOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [resetForm, setResetForm] = useState(false);

  const resetFormState = () => {
    setResetForm((prevResetForm) => !prevResetForm);
  };

  const resetFormData = () => {
    setFormData({
      id_orden_servicio: "",
      id_cliente: "",
      area_programacion: "",
      correo_programacion: "",
      descripcion_mercancia_programacion: "",
      cantidad_bultos_programacion: "",
      ubigeo_programacion: "",
      peso_mercancia_programacion: "",
      direccion_programacion: "",
      peso_volumen_programacion: "",
      referencias_programacion: "",
      metros_cubicos_programacion: "",
      contacto_programacion: "",
      fecha_programacion: "",
      telefono_programacion: "",
      hora_programacion: "",
      id_creador: localStorage.getItem("id_usuario"),
    });
  };

  const [formData, setFormData] = useState({
    id_orden_servicio: "",
    id_cliente: "",
    area_programacion: "",
    correo_programacion: "",
    descripcion_mercancia_programacion: "",
    cantidad_bultos_programacion: "",
    ubigeo_programacion: "",
    peso_mercancia_programacion: "",
    direccion_programacion: "",
    peso_volumen_programacion: "",
    referencias_programacion: "",
    metros_cubicos_programacion: "",
    contacto_programacion: "",
    fecha_programacion: "",
    telefono_programacion: "",
    hora_programacion: "",
    id_creador: localStorage.getItem("id_usuario"),
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // ESTILOS DE PRECARGADO
    Swal.fire({
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "transparent",
      html: `
      <div class="papapa"> 
        <div class="loader1"> 
        <h1 class="guardado" >Guardando...</h1>
        </div>
      
        <div class="loader2">
          <div class="justify-content-center jimu-primary-loading"></div>
        </div>
      </div>
    `,
      onBeforeOpen: () => {
        // Función que se ejecuta antes de que se abra la ventana modal
        Swal.showLoading(); // Muestra una animación de carga dentro de la ventana modal
      },
    });

    try {
      const response = await fetch(
        "https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/guardarProgramacion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
        resetFormState();
        resetFormData();
        setIsButtonDisabled(false);
        setProgramaciones([]);
        setClickEditar(false);
        setSelectedValue("");
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de Red",
      });
      console.log(error);
    }
    cargarSelect();
    cargarProgramaciones();
  };

  useEffect(() => {
    if (clickEditar && datosProgramacion) {
      setFormData({
        ...formData,
        ...datosProgramacion,
      });
    }
  }, [clickEditar, datosProgramacion]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Eliminar Programacion

  const eliminarProgramacion = async (id) => {
    try {
      const response = await fetch(
        `https://sysdemo.byma-ve.com/BackendApiRest/Operaciones/Programacion/eliminarProgramacion.php?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const responseData = await response.json();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
      Swal.fire({
        icon: "error",
        title: "Error en la solicitud de eliminación",
      });
    }
    setSelectedValue("");
    resetFormState();
    resetFormData();
    setIsButtonDisabled(false);
    setProgramaciones([]);
    setClickEditar(false);
    cargarSelect();
    cargarProgramaciones();
  };

  const handleEliminarProgramacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarProgramacion(id);
      }
    });
  };

  // Fin Eliminar Programacion

  return (
    <Home
      children1={
        <>
          <Encabezado
            handleEliminarProgramacion={handleEliminarProgramacion}
            setIsButtonDisabled={setIsButtonDisabled}
            title={"Programación"}
            onSubmit={handleFormSubmit}
            setClickEditar={setClickEditar}
            programacionSeleccionada={programacionSeleccionada}
          />
        </>
      }
      children2={
        <>
          <div className="flex ">
            <div className="tabla-envios w-[74%] xl:w-[78%] mr-2">
              <FormDatos
                setSelectedValue={setSelectedValue}
                selectedValue={selectedValue}
                isButtonDisabled={isButtonDisabled}
                setClickEditar={setClickEditar}
                resetForm={resetForm}
                formData={formData}
                setFormData={setFormData}
                programaciones={ordenesServicio}
                cargarSelect={cargarSelect}
                optionsGuias={optionsGuias}
              />
            </div>
            <div className="datos-remitente  w-[32%] xl:w-[22%]">
              <Listado
                programaciones={programaciones}
                onSelectChange={handleSelectChange}
              />
            </div>
          </div>
        </>
      }
    />
  );
}

export default HomeProg;
