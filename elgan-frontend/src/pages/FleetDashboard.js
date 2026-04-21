import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, LogOut, User, 
    Ship, ClipboardCheck, Clock, HardDrive, Anchor, DollarSign 
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
            window.location.href = '/login'; 
        }
    };

    const fetchMyEntries = useCallback(async () => {
        const token = localStorage.getItem('elgan_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(`${API_BASE_URL}/api/entries/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Ensure we handle the data correctly
            setEntries(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Fleet Data Error:", err);
            setLoading(false);
            if (err.response?.status === 401) {
                const checkToken = localStorage.getItem('elgan_token');
                if (!checkToken) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchMyEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchMyEntries]);

    // --- ANALYTICS CALCULATIONS ---
    const totalSubmissions = entries?.length || 0;
    const recentVol = entries?.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0) || 0;
    
    // This aggregates all income logged in individual manifest entries
    const totalRevenue = entries?.reduce((acc, curr) => acc + (Number(curr.amountMade) || 0), 0) || 0;
    const assessorFee = totalRevenue * 0.02;

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- NAVIGATION --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/fleet')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg shadow-sm border border-slate-100" />
                    <span className="text-xl font-black text-[#0089A3] uppercase tracking-tighter">
                        ELGAN <span className="text-slate-400 font-normal lowercase">fleet</span>
                    </span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex items-center space-x-3 border-r pr-6 border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <p className="text-[10px] font-bold text-[#0089A3] uppercase tracking-widest">Field Personnel</p>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600 border border-slate-200">
                            <User size={20} />
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-red-600 transition-colors font-bold text-sm">
                        <LogOut size={18} className="mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Log</h1>
                        <p className="text-slate-500 font-medium mt-1 italic underline decoration-[#0089A3]/30 text-sm">
                            Offshore Waste Management System.
                        </p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button onClick={() => navigate('/financial-report')} className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 text-white px-5 py-4 rounded-xl hover:bg-black transition-all shadow-lg font-bold text-xs active:scale-95">
                            <ClipboardCheck size={18} className="mr-2 text-[#0089A3]" /> Financial Report
                        </button>
                        <button onClick={() => navigate('/entry')} className="flex-1 md:flex-none flex items-center justify-center bg-[#0089A3] text-white px-5 py-4 rounded-xl hover:bg-[#006F85] transition-all shadow-lg shadow-cyan-100 font-bold text-xs active:scale-95">
                            <Plus size={20} className="mr-2" /> New Entry
                        </button>
                    </div>
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-cyan-50 text-[#0089A3] rounded-xl w-fit mb-4"><Ship size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Vessels Inspected</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-800">{totalSubmissions}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4"><Clock size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">System Health</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-800">Active</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><HardDrive size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Waste Volume (m³)</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-800">{recentVol.toFixed(2)}</h3>
                    </div>
                </div>

                {/* --- HISTORY TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center font-black text-slate-800 text-sm uppercase">
                       <span className="flex items-center"><ClipboardCheck size={16} className="mr-2 text-[#0089A3]" /> Operational History</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-4 font-black">Asset & IMO</th>
                                    <th className="p-4 font-black">Terminal</th>
                                    <th className="p-4 font-black">Category</th>
                                    <th className="p-4 font-black">Qty (m³)</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase text-xs">Syncing Fleet Data...</td></tr>
                                ) : entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/30 transition-colors text-sm font-bold">
                                        <td className="p-4 uppercase text-slate-800">
                                            {entry.vesselName} 
                                            <div className="text-[10px] text-slate-400 font-mono tracking-tighter lowercase">imo: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-4 text-slate-600 uppercase text-xs">
                                            <Anchor size={12} className="inline mr-1 text-slate-300" /> {entry.terminal || 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-cyan-100 text-[#0089A3] px-2 py-1 rounded text-[10px] uppercase tracking-tighter">
                                                {entry.wasteType || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-700">
                                            {Number(entry.volume).toFixed(2)} m³
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-2 text-slate-300 hover:text-[#0089A3] transition-colors"><Edit size={16}/></button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-emerald-600 transition-colors">
                                                        <Download size={16}/>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No entries logged.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FINANCIAL SUMMARY --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-[#0089A3] flex justify-between items-center text-white">
                        <h2 className="font-black text-sm uppercase tracking-widest flex items-center">
                           <DollarSign size={18} className="mr-2 text-cyan-200" /> Monthly Revenue Summary (Aggregated)
                        </h2>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Gross from Logs</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tighter">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
                        </div>
                        <div className="md:text-right">
                            <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-widest mb-1">Accrued 2% Fee</p>
                            <h4 className="text-2xl font-black text-[#0089A3] tracking-tighter">
                                ${assessorFee.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </h4>
                        </div>
                    </div>
                    <div className="bg-slate-100 p-4 text-[9px] text-slate-400 font-bold text-center uppercase tracking-[0.2em]">
                        Note: Revenue is calculated based on individual asset entries logged.
                    </div>
                </div>

                <p className="text-center mt-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
            </main>
        </div>
    );
};

export default FleetDashboard;
