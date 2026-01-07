
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // global styles
import App from "./App";
import { WAProvider } from "@/context/waContext";

//import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WAProvider>
    <App />
    </WAProvider>
  </React.StrictMode>
);
