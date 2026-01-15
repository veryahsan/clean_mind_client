import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { MoodProvider } from "./context/MoodContext";
import { ModalProvider } from "./context/ModalContext";
import { CardProvider } from "./context/CardContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MoodProvider>
          <ModalProvider>
            <CardProvider>
              <App />
            </CardProvider>
          </ModalProvider>
        </MoodProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
