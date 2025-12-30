import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";
import { ApiProvider } from "contexts/ApiContext";
import { NotificationProvider } from "contexts/NotificationContext";
import AppRoutes from "routes";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider apiType="REST">
          <NotificationProvider>
            <AppRoutes />
            <ToastContainer />
          </NotificationProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
