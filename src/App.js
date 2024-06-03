import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import { UserProvider } from './components/UserContext';
import InventoryTable from './pages/InventoryTable';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileInformation from './pages/ProfileInformation';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <UserProvider>
      <Routes>    
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/inventory" element={<PrivateRoute><InventoryTable /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfileInformation/></PrivateRoute>} />
      </Routes>
    </UserProvider>
  );
}

export default App;
