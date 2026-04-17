import { LogOut, LayoutDashboard, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('elgan_token');
    localStorage.removeItem('elgan_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 px-2">ELGAN</h2>
      <nav className="flex-1 space-y-2">
        <button onClick={() => navigate(user.role === 'manager' ? '/manager' : '/fleet')} className="flex items-center w-full p-3 hover:bg-slate-700 rounded">
          <LayoutDashboard className="mr-3" size={20} /> Dashboard
        </button>
        {user.role === 'fleet' && (
          <button onClick={() => navigate('/entry')} className="flex items-center w-full p-3 hover:bg-slate-700 rounded">
            <FilePlus className="mr-3" size={20} /> New Entry
          </button>
        )}
      </nav>
      <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-400 hover:bg-red-900/20 rounded mt-auto">
        <LogOut className="mr-3" size={20} /> Logout
      </button>
    </div>
  );
};