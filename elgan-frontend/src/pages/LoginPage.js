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
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const { user, token } = response.data;
      
      // 1. Save to storage FIRST (prevents immediate logout)
      localStorage.setItem('elgan_token', token);
      localStorage.setItem('elgan_user', JSON.stringify(user));
      localStorage.setItem('elgan_user_name', user.username);
      
      // 2. Update state SECOND
      setUser(user);
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.msg || "Login failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/elgan.jpeg" alt="Logo" className="h-28 w-auto mb-4 object-contain shadow-sm rounded-xl p-2" />
          <p className="text-slate-500 text-sm font-black uppercase tracking-widest text-center leading-tight">
            Offshore <br /> Waste Management System
          </p>
          <div className="h-1.5 w-16 bg-[#0089A3] mx-auto mt-6 rounded-full"></div>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-700 text-[11px] font-bold border-l-4 border-red-500 uppercase animate-pulse">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input type="text" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0089A3] font-black text-slate-700" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input type="password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0089A3] font-black text-slate-700" placeholder="Security Code" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#0089A3] text-white font-black py-4 rounded-xl hover:bg-[#006F85] transition-all flex items-center justify-center shadow-xl shadow-cyan-100 disabled:bg-slate-300 active:scale-95 text-lg">
            {isLoading ? <><Loader2 className="animate-spin mr-2" size={20} /> <span className="text-xs uppercase tracking-widest">Securing Portal...</span></> : "ACCESS PORTAL"}
          </button>
        </form>
        <p className="text-center mt-12 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">© 2026 Elgan integrated Ltd.</p>
      </div>
    </div>
  );
};

export default LoginPage;
