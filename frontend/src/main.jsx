import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./Context/UserContext";
import { NextUIProvider } from "@nextui-org/react";

const root = document.getElementById("root");
const rootContainer = createRoot(root);
rootContainer.render(
  <UserProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </UserProvider>
);
