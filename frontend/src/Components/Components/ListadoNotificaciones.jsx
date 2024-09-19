import React, { useState } from "react";

export const ListadoNotificaciones = ({
  notificacionesData,
  handleClickNotification,
  verClientesText,
  cargarNotificaciones,
}) => {
  // Estado para controlar si alguna notificación ha sido abierta
  const [someNotificationOpened, setSomeNotificationOpened] = useState(false);

  // Función para manejar el clic en la notificación
  const handleNotificationClick = (notification) => {
    // Llamar a la función handleClickNotification pasando la notificación
    handleClickNotification(notification);
    // Marcar que alguna notificación ha sido abierta solo si no hay ninguna abierta aún
    if (!someNotificationOpened) {
      setSomeNotificationOpened(true);
    }
  };

  return (
    <>
      <div
        className="ScrollTableVertical clienteContainer overflow-hidden overflow-y-auto  
       mt-[-13px]"
      >
        {notificacionesData.map((notification, index) => (
          <NotificacionItem
            key={index}
            notification={notification}
            handleClickNotification={handleNotificationClick}
            verClientesText={verClientesText}
            someNotificationOpened={someNotificationOpened}
          />
        ))}
      </div>
    </>
  );
};

const NotificacionItem = ({
  notification,
  handleClickNotification,
  verClientesText,
  someNotificationOpened,
}) => {
  // Estados locales del componente
  const [showMore, setShowMore] = useState(false);
  const [iconVisible, setIconVisible] = useState(true); // Estado para controlar la visibilidad del icono

  // Función para alternar el estado de "showMore"
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Función para manejar el clic en el contenedor de la notificación
  const handleContainerClick = () => {
    // Llamar a la función handleClickNotification pasando la notificación
    handleClickNotification(notification);
    // Ocultar el icono cuando se hace clic en la notificación por primera vez
    if (someNotificationOpened && iconVisible) {
      setIconVisible(false);
    }
  };

  // Determinar si se deben mostrar los botones
  const shouldShowButtons =
    notification.colaboradores_receptores &&
    notification.colaboradores_receptores.length > 1;

  // Determinar si la notificación está abierta
  const notificationOpened = showMore || someNotificationOpened;

  return (
    <div
      onClick={handleContainerClick} // Cambiado el evento onClick para manejar la lógica deseada
      className={`mt-3 px-1 flex items-center relative cursor-pointer rounded-lg mx-1 ${
        notification.visto_notificacion != 0 ? "" : "bg-blue-300 "
      } ${showMore ? "h-auto " : "h-15 "}`}
    >
      <img
        src={`https://images.weserv.nl/?url=${notification.foto_emisor}`}
        alt={`${notification.titulo_notificacion} Photo`}
        className="rounded-full w-10 h-10 -mr-4 ms- "
      />

      <div className="flex flex-col   relative">
        {/* Renderizar información de la notificación */}
        <span className="text-sm font-semibold  w-[75%] mr-2 dark:text-gray-500 ms-6 mt-1 flex  ">
          De: {notification.emisor} -{" "}
          {notification.titulo_notificacion.toUpperCase()}
        </span>
        <span
          className={`w-[70%]  text-xs font-semibold dark:text-gray-500  ms-6 overflow-hidden transition-max-h py-1 ${
            showMore ? "max-h-[200px]" : "max-h-[21px]"
          }`}
          onMouseEnter={() => setShowMore(true)}
          onMouseLeave={() => setShowMore(false)}
        >
          Para: {notification.colaboradores_receptores}
        </span>
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 -ms-[29px]  bg-blue-500 w-[326px] rounded-[6px] transition-bg-opacity ${
            showMore ? "bg-opacity-10" : "bg-opacity-0"
          }`}
        ></div>
      </div>

      <div className="cont-fecha absolute right-1 -mt-5">
        <span className="text-xs font-normal dark:text-gray-400 ">
          {notification.fecha_vigencia_notificacion}
        </span>
      </div>

      {shouldShowButtons && (
        <div
          onClick={toggleShowMore}
          className={`ver-clientes absolute right-[68px]  text-right bottom-0 cursor-pointer mb-[19px]     ${
            showMore ? "bg-white" : "bg-blue-500"
          }`}
        >
          <span className="absolute text-blue-500 font-semibold text-xs w-16  ">
            {showMore ? "Ver menos" : verClientesText || "Ver más"}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificacionItem;
