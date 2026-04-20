import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const { user, token } = response.data;
      
      localStorage.setItem('elgan_token', token);
      localStorage.setItem('elgan_user', JSON.stringify(user));
      localStorage.setItem('elgan_user_name', user.username);
      
      setUser(user);
      navigate(user.role === 'manager' ? '/manager' : '/fleet');
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-4 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-emerald-100">
        
        {/* --- LOGO & HEADER --- */}
        <div className="text-center mb-8">
          {/* Logo Integration */}
          <img 
            src="/elgan.jpeg" 
            alt="Elgan Logo" 
            className="h-24 mx-auto mb-4 object-contain rounded-xl shadow-sm border border-emerald-50"
          />
          
          <p className="text-emerald-700 mt-2 text-sm font-black uppercase tracking-[0.1em]">
            Offshore Waste Management System
          </p>
          <div className="h-1 w-12 bg-emerald-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* --- ERROR DISPLAY --- */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-[11px] font-bold border-l-4 border-red-500 flex items-center uppercase tracking-wide">
            {error}
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-emerald-300" size={18} />
              <input 
                type="text" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" 
                placeholder="Enter Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 ml-1">Security Code</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-emerald-300" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-100 disabled:bg-slate-400 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} /> 
                <span className="uppercase tracking-widest text-xs">Authenticating...</span>
              </>
            ) : (
              <span className="uppercase tracking-widest text-sm">Access Portal</span>
            )}
          </button>
        </form>

        {/* --- FOOTER INSIDE CARD --- */}
        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.15em]">
            © 2026 Elgan Integrated Ltd.
          </p>
          <p className="text-emerald-300 text-[8px] mt-1 font-medium italic">
            Sustainable Offshore Logistics v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
