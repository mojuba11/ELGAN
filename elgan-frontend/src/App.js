import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EntryForm from './pages/EntryForm'; 
import FinancialReportForm from './pages/FinancialReportForm';
import './App.css'; 

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('elgan_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('elgan_user');
      localStorage.removeItem('elgan_token');
      localStorage.removeItem('elgan_user_name');
    }
  }, [user]);

  // Logic to prevent infinite ping-pong loops
  const getInitialRoute = () => {
    if (!user) return <LoginPage setUser={setUser} />;
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    if (user.role === 'fleet') return <Navigate to="/fleet" replace />;
    return <LoginPage setUser={setUser} />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={getInitialRoute()} />

          {/* PROTECTED FLEET ROUTES */}
          <Route 
            path="/fleet" 
            element={user?.role === 'fleet' ? <FleetDashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/entry" 
            element={user?.role === 'fleet' ? <EntryForm /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/financial-report" 
            element={user?.role === 'fleet' ? <FinancialReportForm /> : <Navigate to="/login" replace />} 
          />

          {/* PROTECTED MANAGER ROUTES */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" replace />} 
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
