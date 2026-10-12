import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { MoodProvider } from "./context/MoodContext";
import { ModalProvider } from "./context/ModalContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MoodProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </MoodProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
