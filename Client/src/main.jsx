// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Authprovider } from "../Context/Authcontext";
import { Chatprovider } from "../Context/Chatcontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authprovider>
        <Chatprovider>
          <App />
        </Chatprovider>
      </Authprovider>
    </BrowserRouter>
  </React.StrictMode>
);
