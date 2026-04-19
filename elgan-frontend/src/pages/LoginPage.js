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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 px-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-900 text-white px-4 py-1 rounded-md mb-4 text-xs font-black tracking-[0.2em]">
            OFFSHORE LOGISTICS
          </div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter">ELGAN <span className="text-blue-600">OSM</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Waste Management Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs font-bold border-l-4 border-red-500 flex items-center uppercase tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700" 
                placeholder="Manager or Fleet ID" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Security Code</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:bg-slate-400 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} /> 
                <span className="uppercase tracking-widest text-xs">Authenticating...</span>
              </>
            ) : (
              <span className="uppercase tracking-widest text-sm">Login</span>
            )}
          </button>
        </form>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Elgan Integrated Ltd.
        </p>
        <p className="text-slate-300 text-[9px] mt-1 font-medium italic">
          Secure Offshore Asset Management v2.0
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
