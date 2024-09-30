import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./Context/UserContext";
import { NextUIProvider } from "@nextui-org/react";
import { ColorProvider } from "./Context/ColorProvider";

const root = document.getElementById("root");
const rootContainer = createRoot(root);
rootContainer.render(
  <UserProvider>
    <NextUIProvider>
      <ColorProvider>
        <App />
      </ColorProvider>
    </NextUIProvider>
  </UserProvider>
);
