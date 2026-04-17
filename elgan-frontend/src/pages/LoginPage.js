import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState(''); // Changed from email to username to match backend
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send request to your Head of IT's backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      // 2. Extract user and token from response
      const { user, token } = response.data;

      // 3. Store token in LocalStorage for persistent sessions
      localStorage.setItem('elgan_token', token);

      // 4. Update Global App State
      setUser(user);

      // 5. Navigate based on Role returned from MongoDB
      if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/fleet');
      }
    } catch (err) {
      // Handle errors (Invalid credentials, server down, etc.)
      const errorMsg = err.response?.data?.msg || "Login failed. Check server connection.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">ELGAN</h1>
          <p className="text-slate-500 mt-2 font-medium">Offshore Waste Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:bg-slate-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Authenticating...
              </>
            ) : (
              "ACCESS ELGAN SYSTEM"
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-xs text-slate-400 leading-relaxed">
            <strong>Security Notice:</strong> Authorized access only. Your IP and login attempt will be logged in the system audit trail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;