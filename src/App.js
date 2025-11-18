import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'contexts/AuthContext';
import AppRoutes from 'routes';
import './App.css';
import { ApiProvider } from 'contexts/ApiContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <AppRoutes />
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
