import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('elgan_user')));

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Protected Routes */}
        <Route 
          path="/fleet" 
          element={user?.role === 'fleet' ? <FleetDashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/manager" 
          element={user?.role === 'manager' ? <ManagerDashboard user={user} /> : <Navigate to="/login" />} 
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;