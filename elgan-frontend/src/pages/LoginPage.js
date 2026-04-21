import React, { useState } from 'react';
import { Lock, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        username: username.trim(), 
        password: password 
      });

      const { user, token } = response.data;
      
      // 1. Storage Cleanup - Wipe any old/broken sessions first
      localStorage.clear();

      // 2. Save fresh credentials
      // Save token as a RAW string (no JSON.stringify here to avoid extra quotes)
      localStorage.setItem('elgan_token', token);
      // Save user object as a JSON string
      localStorage.setItem('elgan_user', JSON.stringify(user));
      localStorage.setItem('elgan_user_name', user.username);
      
      // 3. Small delay to ensure browser IO finishes writing to disk
      setTimeout(() => {
        setUser(user);
        setIsLoading(false);
      }, 600);

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.msg || "Login failed. Check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans selection:bg-[#0089A3] selection:text-white">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        
        {/* --- BRANDING --- */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="/elgan.jpeg" 
            alt="Logo" 
            className="h-28 w-auto mb-4 object-contain shadow-sm rounded-xl p-2 border border-slate-100" 
          />
          <p className="text-slate-500 text-sm font-black uppercase tracking-widest text-center leading-tight">
            Offshore <br /> Waste Management System
          </p>
          <div className="h-1.5 w-16 bg-[#0089A3] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-[11px] font-bold border-l-4 border-red-500 uppercase animate-pulse">
            {error}
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              required 
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0089A3] font-black text-slate-700 transition-all" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" 
              required 
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0089A3] font-black text-slate-700 transition-all" 
              placeholder="Security Code" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#0089A3] text-white font-black py-4 rounded-xl hover:bg-[#006F85] transition-all flex items-center justify-center shadow-xl shadow-cyan-100 disabled:bg-slate-300 active:scale-95 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} /> 
                <span className="text-xs uppercase tracking-widest font-bold">Verifying Sync...</span>
              </>
            ) : (
              "ACCESS PORTAL"
            )}
          </button>
        </form>

        {/* --- FOOTER --- */}
        <div className="mt-12 pt-6 border-t border-slate-100">
            <p className="text-center text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                © 2026 Elgan integrated Ltd.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
