import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, LogOut, User, 
    Ship, ClipboardCheck, HardDrive, Anchor, DollarSign, Eye 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const FleetDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [financials, setFinancials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Fleet Operator');
    
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleLogout = () => {
        if (window.confirm("Confirm logout from Fleet Operations?")) {
            localStorage.clear(); 
            window.location.href = '/login'; 
        }
    };

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('elgan_token');
        if (!token) {
            setLoading(false);
            return;
        }

        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            // Fetch Manifest Entries
            const entriesRes = await axios.get(`${API_BASE_URL}/api/entries/all`, config);
            setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);

            // Fetch Latest Financial Report
            const finRes = await axios.get(`${API_BASE_URL}/api/financials/all`, config);
            if (Array.isArray(finRes.data) && finRes.data.length > 0) {
                // Get the most recent report submitted
                setFinancials(finRes.data[finRes.data.length - 1]);
            }

            setLoading(false);
        } catch (err) {
            console.error("Dashboard Data Sync Error:", err);
            setLoading(false);
            if (err.response?.status === 401 && !localStorage.getItem('elgan_token')) {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchData]);

    // Derived Stats
    const totalSubmissions = entries?.length || 0;
    const totalVolume = entries?.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0) || 0;

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

            <main className="p-4 md:p-8 max-w-[1500px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Operations Log</h1>
                        <p className="text-slate-500 font-medium mt-1 italic underline decoration-[#0089A3]/30 text-sm">
                            Certified Waste Management & Asset Tracking.
                        </p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button onClick={() => navigate('/financial-report')} className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 text-white px-5 py-4 rounded-xl hover:bg-black transition-all shadow-lg font-bold text-xs active:scale-95">
                            <ClipboardCheck size={18} className="mr-2 text-[#0089A3]" /> Monthly Finance
                        </button>
                        <button onClick={() => navigate('/entry')} className="flex-1 md:flex-none flex items-center justify-center bg-[#0089A3] text-white px-5 py-4 rounded-xl hover:bg-[#006F85] transition-all shadow-lg shadow-cyan-100 font-bold text-xs active:scale-95">
                            <Plus size={20} className="mr-2" /> New Entry
                        </button>
                    </div>
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-cyan-50 text-[#0089A3] rounded-xl w-fit mb-4"><Ship size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Assets Logged</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-800">{totalSubmissions} Vessels</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><HardDrive size={24} /></div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Cumulative Waste Volume</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-800">{totalVolume.toFixed(2)} m³</h3>
                    </div>
                </div>

                {/* --- DETAILED OPERATIONS TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center font-black text-slate-800 text-sm uppercase">
                       <span className="flex items-center"><Ship size={16} className="mr-2 text-[#0089A3]" /> Operational History</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-4 font-black">Vessel Name / IMO</th>
                                    <th className="p-4 font-black">Arrival / MCI No</th>
                                    <th className="p-4 font-black">Inspection Date</th>
                                    <th className="p-4 font-black">Terminal</th>
                                    <th className="p-4 font-black">Agent Name</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase text-xs">Syncing Fleet Data...</td></tr>
                                ) : entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/30 transition-colors text-sm font-bold">
                                        <td className="p-4">
                                            <div className="text-slate-800 uppercase">{entry.vesselName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono lowercase">imo: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-700">{entry.dateOfArrival ? new Date(entry.dateOfArrival).toLocaleDateString() : 'N/A'}</div>
                                            <div className="text-[10px] text-[#0089A3] uppercase">{entry.mciNumber || 'No MCI'}</div>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {entry.dateOfInspection ? new Date(entry.dateOfInspection).toLocaleDateString() : 'Pending'}
                                        </td>
                                        <td className="p-4 text-slate-600 uppercase text-xs">
                                            <Anchor size={12} className="inline mr-1 text-slate-300" /> {entry.terminal || 'N/A'}
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium">
                                            {entry.agentName || 'Not Assigned'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button className="flex items-center bg-slate-100 hover:bg-[#0089A3] hover:text-white px-3 py-1.5 rounded-lg text-[10px] uppercase transition-all">
                                                    <Eye size={14} className="mr-1" /> Details
                                                </button>
                                                <button className="flex items-center bg-slate-100 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] uppercase transition-all">
                                                    <Edit size={14} className="mr-1" /> Edit
                                                </button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-[#0089A3]">
                                                        <Download size={16}/>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MONTHLY FINANCIAL SUMMARY --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 bg-[#0089A3] flex justify-between items-center text-white">
                        <h2 className="font-black text-sm uppercase tracking-widest flex items-center">
                           <DollarSign size={18} className="mr-2 text-cyan-200" /> Monthly Revenue Summary (From Reports)
                        </h2>
                        {financials && (
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                Period: {financials.reportMonth}
                            </span>
                        )}
                    </div>
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Monthly Income</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tighter">
                                ${financials ? Number(financials.totalIncome).toLocaleString() : '0.00'}
                            </h4>
                        </div>
                        <div className="md:text-right">
                            <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-widest mb-1">2% Assessor Fee (Verified)</p>
                            <h4 className="text-2xl font-black text-[#0089A3] tracking-tighter">
                                ${financials ? Number(financials.assessorFee).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
                            </h4>
                        </div>
                    </div>
                    {!financials && (
                        <div className="p-4 text-center bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest">
                            No monthly financial report has been filed for the current period.
                        </div>
                    )}
                </div>

                <p className="text-center mt-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
            </main>
        </div>
    );
};

export default FleetDashboard;
