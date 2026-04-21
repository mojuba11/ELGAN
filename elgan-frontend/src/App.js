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

  // --- 1. BOOTSTRAP SESSION ONCE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('elgan_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Safety check for valid roles
        if (parsed && (parsed.role === 'fleet' || parsed.role === 'manager')) {
          setUser(parsed);
        } else {
          localStorage.clear();
        }
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsInitialLoad(false);
  }, []);

  // --- 2. CLEANUP LOGIC ---
  useEffect(() => {
    if (!user && !isInitialLoad) {
      localStorage.removeItem('elgan_user');
      localStorage.removeItem('elgan_token');
      localStorage.removeItem('elgan_user_name');
    }
  }, [user, isInitialLoad]);

  // Prevent routing until the session check is finished
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0089A3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0089A3] font-black uppercase tracking-widest text-[10px]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- PUBLIC ACCESS --- */}
          <Route 
            path="/login" 
            element={!user ? (
              <LoginPage setUser={setUser} />
            ) : (
              <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} replace />
            )} 
          />

          {/* --- FLEET PERSONNEL PROTECTED ROUTES --- */}
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

          {/* --- ADMIN PROTECTED ROUTES --- */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" replace />} 
          />

          {/* --- FALLBACKS --- */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
