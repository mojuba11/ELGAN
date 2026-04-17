import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  // Check if user is already logged in via LocalStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('elgan_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync state to local storage if user changes (e.g., logging out)
  useEffect(() => {
    if (!user) {
      localStorage.removeItem('elgan_user');
      localStorage.removeItem('elgan_token');
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Route: If logged in, skip login and go to dashboard */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} />} 
        />

        {/* Protected Fleet Route */}
        <Route 
          path="/fleet" 
          element={user?.role === 'fleet' ? <FleetDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />

        {/* Protected Manager Route */}
        <Route 
          path="/manager" 
          element={user?.role === 'manager' ? <ManagerDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;