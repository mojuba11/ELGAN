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
      setUser(user);
      navigate(user.role === 'manager' ? '/manager' : '/fleet');
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900">ELGAN</h1>
          <p className="text-slate-500 mt-2">Offshore Waste Management System</p>
        </div>
        {error && <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm border-l-4 border-red-500">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input type="text" required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input type="password" required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 flex items-center justify-center disabled:bg-slate-400">
            {isLoading ? <><Loader2 className="animate-spin mr-2" size={20} /> Authenticating...</> : "ACCESS ELGAN SYSTEM"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;