import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, LogOut, 
    Ship, ClipboardCheck, HardDrive, DollarSign, Eye, X 
} from 'lucide-react'; // Removed 'User' to fix the build error
import { useNavigate } from 'react-router-dom';

const FleetDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [financials, setFinancials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Fleet Operator');
    
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleLogout = () => {
        if (window.confirm("Confirm logout?")) {
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

        const config = { 
            headers: { 'Authorization': `Bearer ${token.replace(/['"]+/g, '').trim()}` } 
        };

        try {
            // Fetch Manifest Entries
            const entriesRes = await axios.get(`${API_BASE_URL}/api/entries/all`, config);
            setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);

            // Fetch Latest Financial Report
            const finRes = await axios.get(`${API_BASE_URL}/api/financials/all`, config);
            if (Array.isArray(finRes.data) && finRes.data.length > 0) {
                setFinancials(finRes.data[finRes.data.length - 1]);
            }

            setLoading(false);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchData]);

    const totalSubmissions = entries?.length || 0;
    const totalVolume = entries?.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0) || 0;

    const handleViewDetails = (entry) => {
        setSelectedEntry(entry);
        setShowModal(true);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- NAVIGATION --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/fleet')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg" />
                    <span className="text-xl font-black text-[#0089A3] uppercase tracking-tighter">ELGAN</span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{userName}</p>
                        <p className="text-[10px] font-bold text-[#0089A3] uppercase tracking-widest">Operator</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fleet Operations</h1>
                        <p className="text-slate-500 font-medium mt-1 italic underline decoration-[#0089A3]/30 text-sm">Certified Asset tracking.</p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button onClick={() => navigate('/financial-report')} className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 text-white px-5 py-4 rounded-xl hover:bg-black transition-all shadow-lg font-bold text-xs uppercase">
                            <ClipboardCheck size={18} className="mr-2 text-[#0089A3]" /> Monthly Finance
                        </button>
                        <button onClick={() => navigate('/entry')} className="flex-1 md:flex-none flex items-center justify-center bg-[#0089A3] text-white px-5 py-4 rounded-xl hover:bg-[#006F85] transition-all shadow-lg font-bold text-xs uppercase">
                            <Plus size={20} className="mr-2" /> New Entry
                        </button>
                    </div>
                </div>

                {/* --- STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="p-4 bg-cyan-50 text-[#0089A3] rounded-xl"><Ship size={32} /></div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Vessels</p>
                            <h3 className="text-3xl font-bold text-slate-800">{totalSubmissions}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><HardDrive size={32} /></div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Volume</p>
                            <h3 className="text-3xl font-bold text-slate-800">{totalVolume.toFixed(2)} m³</h3>
                        </div>
                    </div>
                </div>

                {/* --- SEPARATED TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 font-black text-slate-800 text-sm uppercase">
                       Operational History
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-4 font-black border-r border-slate-100">Vessel Name</th>
                                    <th className="p-4 font-black border-r border-slate-100">IMO Number</th>
                                    <th className="p-4 font-black border-r border-slate-100">Arrival Date</th>
                                    <th className="p-4 font-black border-r border-slate-100">MCI Number</th>
                                    <th className="p-4 font-black border-r border-slate-100">Inspection Date</th>
                                    <th className="p-4 font-black border-r border-slate-100">Terminal</th>
                                    <th className="p-4 font-black border-r border-slate-100">Agent Name</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase text-xs">Syncing...</td></tr>
                                ) : entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/20 transition-colors text-xs font-bold uppercase text-slate-700">
                                        <td className="p-4 text-[#0089A3] font-black border-r border-slate-50">{entry.vesselName}</td>
                                        <td className="p-4 font-mono border-r border-slate-50">{entry.imoNumber}</td>
                                        <td className="p-4 border-r border-slate-50">{entry.dateOfArrival}</td>
                                        <td className="p-4 border-r border-slate-50">{entry.mciNumber || 'N/A'}</td>
                                        <td className="p-4 text-orange-600 border-r border-slate-50">{entry.dateOfInspection || 'Pending'}</td>
                                        <td className="p-4 border-r border-slate-50">{entry.terminal}</td>
                                        <td className="p-4 border-r border-slate-50">{entry.agentName || 'Not Assigned'}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => handleViewDetails(entry)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-[#0089A3] hover:text-white transition-all"><Eye size={16}/></button>
                                                <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Edit size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8" className="p-20 text-center text-slate-400 font-bold uppercase text-xs">No entries found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FINANCIALS --- */}
                <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center text-white">
                        <h2 className="font-black text-sm uppercase tracking-[0.2em] flex items-center">
                           <DollarSign size={20} className="mr-2 text-[#0089A3]" /> Monthly Revenue Summary
                        </h2>
                        {financials && <span className="text-[10px] font-black bg-white/10 px-4 py-1 rounded-full uppercase tracking-widest text-[#0089A3]">Period: {financials.reportMonth}</span>}
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gross Monthly Income</p>
                            <h4 className="text-4xl font-black text-white tracking-tighter">
                                ${financials ? Number(financials.totalIncome).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
                            </h4>
                        </div>
                        <div className="md:text-right">
                            <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-widest mb-2">2% Assessor Fee</p>
                            <h4 className="text-4xl font-black text-[#0089A3] tracking-tighter">
                                ${financials ? Number(financials.assessorFee).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
                            </h4>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MODAL --- */}
            {showModal && selectedEntry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#0089A3] p-8 flex justify-between items-center text-white">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Vessel Manifest</h2>
                            <button onClick={() => setShowModal(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24} /></button>
                        </div>
                        <div className="p-10 grid grid-cols-2 gap-y-8 gap-x-12 text-sm uppercase border-b border-slate-50">
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Vessel Name</p><p className="font-black text-slate-800 text-lg">{selectedEntry.vesselName}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">IMO Number</p><p className="font-bold text-slate-800">{selectedEntry.imoNumber}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Agent Name</p><p className="font-bold text-slate-800">{selectedEntry.agentName || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">MCI Number</p><p className="font-bold text-slate-800">{selectedEntry.mciNumber || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Arrival Date</p><p className="font-bold text-slate-800">{selectedEntry.dateOfArrival}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Inspection Date</p><p className="font-bold text-orange-600">{selectedEntry.dateOfInspection}</p></div>
                        </div>
                        <div className="px-10 py-6 bg-slate-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-[10px] text-slate-400 font-black uppercase">Waste Volume</p>
                                <p className="text-2xl font-black text-slate-800">{selectedEntry.volume} m³</p>
                            </div>
                            <div className="flex space-x-3">
                                {selectedEntry.fileUrl && (
                                    <a href={`${API_BASE_URL}/uploads/${selectedEntry.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center bg-[#0089A3] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase">
                                        <Download size={14} className="mr-2" /> Manifest
                                    </a>
                                )}
                                <button onClick={() => setShowModal(false)} className="bg-slate-200 text-slate-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetDashboard;
