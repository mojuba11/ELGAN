import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FleetDashboard from './pages/FleetDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EntryForm from './pages/EntryForm'; 
import FinancialReportForm from './pages/FinancialReportForm';
import './App.css'; 

function App() {
  // --- 1. INSTANT SESSION RECOVERY ---
  // We check LocalStorage IMMEDIATELY so the state isn't null on tab switch
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('elgan_user');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return (parsed && parsed.role) ? parsed : null;
    } catch (e) {
      return null;
    }
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure the DOM and Storage are synced
    setIsReady(true);
  }, []);

  // --- 2. SELECTIVE CLEANUP ---
  // Only wipe storage if the user is EXPLICITLY null (meaning they clicked Logout)
  useEffect(() => {
    if (isReady && user === null) {
      localStorage.removeItem('elgan_user');
      localStorage.removeItem('elgan_token');
      localStorage.removeItem('elgan_user_name');
    }
  }, [user, isReady]);

  if (!isReady) return null; // Prevent flicker on load

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={user.role === 'manager' ? '/manager' : '/fleet'} replace />} 
          />

          {/* Role-Protected Fleet Routes */}
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

          {/* Role-Protected Manager Routes */}
          <Route 
            path="/manager" 
            element={user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" replace />} 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
