import React, { createContext, useState, useContext } from "react";
import { useUser } from "../Hooks/useUser";

export const UserContext = createContext();
export const usePreload = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  // Uso mi custom Hook para obtener los datos del usuario
  const { userData, hora } = useUser();
  const [showPreload, setShowPreload] = useState(false);
  return (
    <UserContext.Provider
      value={{ userData, hora, showPreload, setShowPreload }}
    >
      {children}
    </UserContext.Provider>
  );
};
