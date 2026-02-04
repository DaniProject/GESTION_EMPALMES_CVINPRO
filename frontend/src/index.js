import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Selecciona el elemento root del HTML
const rootElement = document.getElementById("root");

// Crea el root y renderiza la aplicación
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);