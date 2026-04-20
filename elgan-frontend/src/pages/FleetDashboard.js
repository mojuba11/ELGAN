import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, LogOut, User, 
    Ship, ClipboardCheck, Clock, HardDrive, Anchor, DollarSign, FileSpreadsheet
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

    // Fetch personal fleet entries with 401 handling
    const fetchMyEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/api/entries/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEntries(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Fleet Data Error:", err);
            setLoading(false);
            if (err.response?.status === 401) {
                localStorage.removeItem('elgan_token');
                navigate('/login');
            }
        }
    }, [API_BASE_URL, navigate]);

    useEffect(() => {
        fetchMyEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchMyEntries]);

    // Derived Stats
    const totalSubmissions = entries.length;
    const recentVol = entries.reduce((acc, curr) => acc + (curr.volume || 0), 0);
    const totalRevenue = entries.reduce((acc, curr) => acc + (curr.amountMade || 0), 0);
    const assessorFee = totalRevenue * 0.02; // 2% calculation

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- EXECUTIVE TOP BAR --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/fleet')}>
                    <img 
                        src="/elgan.jpeg" 
                        alt="ELGAN" 
                        className="h-10 w-auto rounded-lg shadow-sm border border-slate-100" 
                    />
                    <span className="text-xl font-black text-[#0089A3] tracking-tighter uppercase">
                        Elgan <span className="text-slate-400 font-normal lowercase">fleet</span>
                    </span>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-6">
                    <div className="hidden sm:flex items-center space-x-3 border-r pr-6 border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <p className="text-[10px] font-bold text-[#0089A3] uppercase tracking-widest text-right">Field Personnel</p>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600 border border-slate-200">
                            <User size={20} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center text-slate-400 hover:text-red-600 transition-colors font-bold text-sm"
                    >
                        <LogOut size={18} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
                {/* --- HEADER & ACTIONS --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Log</h1>
                        <p className="text-slate-500 font-medium mt-1 italic underline decoration-[#0089A3]/30 decoration-4">Offshore Waste Management System.</p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/financial-report')}
                            className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 text-white px-5 py-3 rounded-xl hover:bg-black transition shadow-lg font-bold text-xs active:scale-95"
                        >
                            <FileSpreadsheet size={18} className="mr-2 text-[#0089A3]" /> Fill Financial Report
                        </button>
                        <button 
                            onClick={() => navigate('/entry')}
                            className="flex-1 md:flex-none flex items-center justify-center bg-[#0089A3] text-white px-5 py-3 rounded-xl hover:bg-[#006F85] transition shadow-lg shadow-cyan-100 font-bold text-xs active:scale-95"
                        >
                            <Plus size={20} className="mr-2" /> File New Entry
                        </button>
                    </div>
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-cyan-50 text-[#0089A3] rounded-xl w-fit mb-4"><Ship size={24} /></div>
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
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{recentVol.toFixed(2)}</h3>
                    </div>
                </div>

                {/* --- OPERATIONAL HISTORY TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-tighter flex items-center">
                           <ClipboardCheck size={16} className="mr-2 text-[#0089A3]" /> Operational History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-50">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset & IMO</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Terminal</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waste Category</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric Vol.</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase text-xs tracking-widest">Syncing Fleet Database...</td></tr>
                                ) : entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">{entry.vesselName}</div>
                                            <div className="text-[9px] text-slate-400 font-mono tracking-tighter italic">IMO: {entry.imoNumber || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-slate-600 uppercase">
                                            <Anchor size={12} className="inline mr-1 text-slate-400" /> {entry.terminal || 'N/A'}
                                        </td>
                                        <td className="p-4 text-xs font-medium text-slate-500 italic">
                                            {new Date(entry.dateOfArrival || entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-cyan-50 text-[#0089A3] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-cyan-100">
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-black text-slate-700 tracking-tighter">
                                            {entry.volume} m³
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="p-2 text-slate-300 hover:text-[#0089A3] hover:bg-cyan-50 rounded-lg transition"><Edit size={16}/></button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                                                        <Download size={16}/>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No entries logged.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FINANCIAL REPORT CARD --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-[#0089A3] flex justify-between items-center text-white">
                        <h2 className="font-black text-sm uppercase tracking-widest flex items-center">
                           <DollarSign size={18} className="mr-2 text-cyan-200" /> Monthly Financial Summary
                        </h2>
                        <div className="text-[10px] font-black bg-white/20 text-white px-2 py-1 rounded tracking-widest uppercase backdrop-blur-sm">
                            Status: Unaudited
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Month</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Logs</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Income Generated</th>
                                    <th className="p-4 text-[10px] font-black text-[#0089A3] uppercase tracking-widest">2% Assessor Fee</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 font-black text-slate-800 uppercase text-sm">
                                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="p-5 text-sm font-bold text-slate-500">
                                        {totalSubmissions} Manifests
                                    </td>
                                    <td className="p-5 text-lg font-black text-slate-800 tracking-tighter">
                                        ${totalRevenue.toLocaleString()}
                                    </td>
                                    <td className="p-5">
                                        <div className="text-lg font-black text-[#0089A3] tracking-tighter">
                                            ${assessorFee.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </div>
                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Due to Authority</div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button className="text-[10px] font-black text-[#0089A3] border border-[#0089A3] px-3 py-1.5 rounded-lg hover:bg-[#0089A3] hover:text-white transition uppercase tracking-widest">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center mt-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
                    © 2026 Elgan integrated Ltd.
                </p>
            </main>
        </div>
    );
};

export default FleetDashboard;
