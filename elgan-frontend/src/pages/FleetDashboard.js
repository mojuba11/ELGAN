import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Plus, Download, Edit, LogOut, User, 
    Ship, ClipboardCheck, HardDrive, Anchor, DollarSign, Eye, X 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const FleetDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [financials, setFinancials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Fleet Operator');
    
    // MODAL STATE
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
            const entriesRes = await axios.get(`${API_BASE_URL}/api/entries/all`, config);
            setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
            const finRes = await axios.get(`${API_BASE_URL}/api/financials/all`, config);
            if (Array.isArray(finRes.data) && finRes.data.length > 0) {
                setFinancials(finRes.data[finRes.data.length - 1]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Sync Error:", err);
            setLoading(false);
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

    // Helper to open modal
    const handleViewDetails = (entry) => {
        setSelectedEntry(entry);
        setShowModal(true);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- NAVIGATION --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/fleet')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg shadow-sm" />
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
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Fleet Dashboard</h1>
                        <p className="text-slate-500 text-sm italic">Operational Tracking & Financial Overview</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => navigate('/financial-report')} className="bg-slate-800 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">Monthly Report</button>
                        <button onClick={() => navigate('/entry')} className="bg-[#0089A3] text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">+ New Entry</button>
                    </div>
                </div>

                {/* --- STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center space-x-4">
                        <div className="bg-cyan-50 p-4 rounded-xl text-[#0089A3]"><Ship size={30}/></div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase">Total Vessels</p>
                            <h2 className="text-3xl font-black">{totalSubmissions}</h2>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center space-x-4">
                        <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><HardDrive size={30}/></div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase">Total Volume</p>
                            <h2 className="text-3xl font-black">{totalVolume.toFixed(2)} m³</h2>
                        </div>
                    </div>
                </div>

                {/* --- SEPARATED COLUMNS TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-500 bg-slate-50/50 border-b">
                                    <th className="p-4 font-black">Vessel Name</th>
                                    <th className="p-4 font-black">IMO Number</th>
                                    <th className="p-4 font-black">Arrival Date</th>
                                    <th className="p-4 font-black">MCI Number</th>
                                    <th className="p-4 font-black">Inspection</th>
                                    <th className="p-4 font-black">Terminal</th>
                                    <th className="p-4 font-black">Agent Name</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs font-bold text-slate-700">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-10 text-center animate-pulse">Syncing...</td></tr>
                                ) : entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-slate-50 transition-colors uppercase">
                                        <td className="p-4 text-[#0089A3]">{entry.vesselName}</td>
                                        <td className="p-4 font-mono">{entry.imoNumber}</td>
                                        <td className="p-4">{entry.dateOfArrival}</td>
                                        <td className="p-4">{entry.mciNumber || 'N/A'}</td>
                                        <td className="p-4 text-orange-600">{entry.dateOfInspection}</td>
                                        <td className="p-4">{entry.terminal}</td>
                                        <td className="p-4">{entry.agentName || 'N/A'}</td>
                                        <td className="p-4 text-right flex justify-end space-x-2">
                                            <button onClick={() => handleViewDetails(entry)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-800 hover:text-white transition-all"><Eye size={16}/></button>
                                            <button className="p-2 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FINANCIALS --- */}
                <div className="bg-slate-900 text-white rounded-2xl p-8 flex justify-between items-center shadow-xl">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Month Revenue</p>
                        <h2 className="text-4xl font-black">${financials ? Number(financials.totalIncome).toLocaleString() : '0.00'}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0089A3] mb-2">2% Assessor Fee</p>
                        <h2 className="text-4xl font-black text-[#0089A3]">${financials ? Number(financials.assessorFee).toLocaleString(undefined,{minimumFractionDigits:2}) : '0.00'}</h2>
                    </div>
                </div>
            </main>

            {/* --- DETAILS MODAL --- */}
            {showModal && selectedEntry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#0089A3] p-6 flex justify-between items-center text-white">
                            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center">
                                <Ship className="mr-3" /> Full Asset Manifest
                            </h2>
                            <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-all"><X /></button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-y-6 gap-x-8 text-sm uppercase">
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Vessel Name</p><p className="font-bold text-slate-800">{selectedEntry.vesselName}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">IMO Number</p><p className="font-bold text-slate-800">{selectedEntry.imoNumber}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Agent Name</p><p className="font-bold text-slate-800">{selectedEntry.agentName || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">MCI Number</p><p className="font-bold text-slate-800">{selectedEntry.mciNumber || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Arrival Date</p><p className="font-bold text-slate-800">{selectedEntry.dateOfArrival}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Inspection Date</p><p className="font-bold text-slate-800">{selectedEntry.dateOfInspection}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Terminal/Berth</p><p className="font-bold text-slate-800">{selectedEntry.terminal}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1">Waste Type</p><p className="font-bold text-[#0089A3]">{selectedEntry.wasteType}</p></div>
                            <div className="col-span-2 border-t pt-4">
                                <p className="text-[10px] text-slate-400 font-black mb-1">Logged Volume</p>
                                <p className="text-2xl font-black text-slate-800">{selectedEntry.volume} m³</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex justify-end space-x-3">
                             {selectedEntry.fileUrl && (
                                <a href={`${API_BASE_URL}/uploads/${selectedEntry.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                                    <Download size={14} className="mr-2" /> Download Manifest
                                </a>
                             )}
                            <button onClick={() => setShowModal(false)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FleetDashboard;
