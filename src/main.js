import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // global styles
import App from "./App";
import { WAProvider } from "@/context/waContext";
//import "./tailwind.css";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(WAProvider, { children: _jsx(App, {}) }) }));
