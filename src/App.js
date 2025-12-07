import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "contexts/AuthContext";
import AppRoutes from "routes";
import "./App.css";
import { ApiProvider } from "contexts/ApiContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider apiType="MOCK">
          <AppRoutes />
          <ToastContainer />
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
