import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EntryForm from './pages/EntryForm'; 
import FinancialReportForm from './pages/FinancialReportForm';
import './App.css'; 

function App() {
  const [user, setUser] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('elgan_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsInitialLoad(false);
  }, []);

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0089A3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Access */}
          <Route 
            path="/login" 
            element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} replace />} 
          />

          {/* Fleet Protected Routes */}
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

          {/* Manager Protected Routes */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" replace />} 
          />

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
