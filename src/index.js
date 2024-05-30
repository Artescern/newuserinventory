import ReactDOM from 'react-dom/client';
import App from './App';
import{ BrowserRouter } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
