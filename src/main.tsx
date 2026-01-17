import "./index.css";
import App from "./App.tsx";
import { QueueProvider } from "./context/QueueProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueueProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueueProvider>
  </React.StrictMode>
);
