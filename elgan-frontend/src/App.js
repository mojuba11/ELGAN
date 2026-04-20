import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EntryForm from './pages/EntryForm'; 
import FinancialReportForm from './pages/FinancialReportForm'; // NEW IMPORT
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

  // Sync state to local storage if user changes (e.g., logging out)
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
          {/* Public Route: Login */}
          <Route 
            path="/login" 
            element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} replace />} 
          />

          {/* Protected Fleet Routes */}
          <Route 
            path="/fleet" 
            element={user?.role === 'fleet' ? <FleetDashboard user={user} setUser={setUser} /> : <Navigate to="/login" replace />} 
          />

          {/* Protected Entry Form Route */}
          <Route 
            path="/entry" 
            element={user?.role === 'fleet' ? <EntryForm /> : <Navigate to="/login" replace />} 
          />

          {/* NEW: Protected Financial Report Route */}
          <Route 
            path="/financial-report" 
            element={user?.role === 'fleet' ? <FinancialReportForm /> : <Navigate to="/login" replace />} 
          />

          {/* Protected Manager Route */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard user={user} setUser={setUser} /> : <Navigate to="/login" replace />} 
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
