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
      <AuthProvider authApiType={process.env.REACT_APP_AUTH_API_TYPE || "MOCK"}>
        <ApiProvider apiType={process.env.REACT_APP_API_TYPE || "MOCK"}>
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
