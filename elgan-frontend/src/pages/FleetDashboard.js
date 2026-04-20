import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, Send, LogOut, User, 
    Ship, ClipboardCheck, Clock, HardDrive, BarChart3, Anchor 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FleetDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Fleet Operator');
    
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // --- SECURE LOGOUT ---
    const handleLogout = () => {
        if (window.confirm("Confirm logout from Fleet Operations?")) {
            localStorage.clear(); 
            navigate('/login');
            window.location.reload(); 
        }
    };

    // Fetch personal fleet entries
    const fetchMyEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            const res = await axios.get(`${API_BASE_URL}/api/entries/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEntries(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fleet Data Error:", err);
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchMyEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchMyEntries]);

    // Derived Stats for Operator
    const totalSubmissions = entries.length;
    const recentVol = entries.slice(0, 5).reduce((acc, curr) => acc + (curr.volume || 0), 0);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* --- EXECUTIVE TOP BAR --- */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/fleet')}>
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BarChart3 className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">
                        ELGAN <span className="text-blue-600 uppercase">Fleet</span>
                    </span>
                </div>
                
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 border-r pr-6 border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-right">Field Personnel</p>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600 border border-slate-200">
                            <User size={20} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center text-slate-500 hover:text-red-600 transition-colors font-bold text-sm"
                    >
                        <LogOut size={18} className="mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-[1400px] mx-auto">
                {/* --- HEADER --- */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Log</h1>
                        <p className="text-slate-500 font-medium mt-1 italic underline decoration-blue-200 decoration-4">Digital Waste Collection tracking for offshore assets.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/entry')}
                        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold active:scale-95"
                    >
                        <Plus size={20} className="mr-2" /> File New Entry
                    </button>
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><Ship size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Vessel Inspected</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{totalSubmissions}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><Clock size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pending Verification</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">0</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><HardDrive size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Waste Volume (m³)</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{recentVol}</h3>
                    </div>
                </div>

                {/* --- PROFESSIONAL LOGISTICS TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-tighter flex items-center">
                           <ClipboardCheck size={16} className="mr-2 text-blue-600" /> Operational History
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entries.length} Entries Logged</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-50">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset & IMO</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terminal</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waste Category</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric Vol.</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase text-xs">Syncing Fleet Database...</td></tr>
                                ) : entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">{entry.vesselName}</div>
                                            <div className="text-[9px] text-slate-400 font-mono italic tracking-tighter">IMO: {entry.imoNumber || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-slate-600 text-xs font-bold uppercase">
                                                <Anchor size={12} className="mr-1 text-slate-400" /> {entry.terminal || 'Berth N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-slate-500 italic">
                                            {new Date(entry.dateOfArrival || entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-black text-slate-700 tracking-tighter">
                                            {entry.volume} m³
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100">
                                                    <Edit size={16}/>
                                                </button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition border border-transparent hover:border-emerald-100">
                                                        <Download size={16}/>
                                                    </a>
                                                )}
                                                <button className="p-2 text-slate-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition border border-transparent hover:border-purple-100">
                                                    <Send size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                    <HardDrive size={40} className="text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No entries found in your field log.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FleetDashboard;
