import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EntryForm from './pages/EntryForm'; 
import FinancialReportForm from './pages/FinancialReportForm';
import './App.css'; 

function App() {
  // Check if user is already logged in via LocalStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('elgan_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync state to local storage and handle session cleanup
  useEffect(() => {
    if (!user) {
      localStorage.removeItem('elgan_user');
      localStorage.removeItem('elgan_token');
      localStorage.removeItem('elgan_user_name');
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- PUBLIC ACCESS --- */}
          <Route 
            path="/login" 
            element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} replace />} 
          />

          {/* --- FLEET PERSONNEL ROUTES --- */}
          {/* Main Operational Log */}
          <Route 
            path="/fleet" 
            element={user?.role === 'fleet' ? <FleetDashboard /> : <Navigate to="/login" replace />} 
          />

          {/* New Manifest Entry Form */}
          <Route 
            path="/entry" 
            element={user?.role === 'fleet' ? <EntryForm /> : <Navigate to="/login" replace />} 
          />

          {/* Monthly Financial Reporting */}
          <Route 
            path="/financial-report" 
            element={user?.role === 'fleet' ? <FinancialReportForm /> : <Navigate to="/login" replace />} 
          />

          {/* --- ADMINISTRATIVE ROUTES --- */}
          {/* Compliance & Audit Hub */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" replace />} 
          />

          {/* --- FALLBACKS --- */}
          {/* Redirect any unknown path to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
