import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Search, FileText, FilterX, 
    LogOut, User, BarChart3, Trash2, Anchor, CheckCircle2
} from 'lucide-react'; // Cleaned unused imports: Ship, DollarSign, AlertCircle

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userName, setUserName] = useState('Operational Manager');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.clear(); 
            navigate('/login');
            window.location.reload(); 
        }
    };

    const fetchEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            const url = `${API_BASE_URL}/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            
            const res = await axios.get(url, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            setEntries(res.data);
        } catch (err) {
            console.error("Audit Fetch Error:", err);
        }
    }, [API_BASE_URL, searchTerm, wasteType, startDate, endDate]);

    useEffect(() => {
        fetchEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchEntries]);

    const handleDelete = async (id) => {
        if (window.confirm("CRITICAL: Are you sure you want to delete this record? This cannot be undone.")) {
            try {
                const token = localStorage.getItem('elgan_token');
                await axios.delete(`${API_BASE_URL}/api/entries/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchEntries();
            } catch (err) {
                alert("Error deleting record. Check permissions.");
            }
        }
    };

    const totalRevenue = entries.reduce((acc, curr) => acc + (curr.amountMade || 0), 0);
    const totalVolume = entries.reduce((acc, curr) => acc + (curr.volume || 0), 0);

    const resetFilters = () => {
        setSearchTerm('');
        setWasteType('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BarChart3 className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">
                        ELGAN <span className="text-blue-600 uppercase">Operations</span>
                    </span>
                </div>
                
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 border-r pr-6 border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-right">Administrator Access</p>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600 border border-slate-200">
                            <User size={20} />
                        </div>
                    </div>
                    
                    <button onClick={handleLogout} className="flex items-center text-slate-500 hover:text-red-600 transition-colors font-bold text-sm">
                        <LogOut size={18} className="mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-[1600px] mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance & Audit Hub</h1>
                        <p className="text-slate-500 mt-1 font-medium italic underline decoration-blue-200 decoration-4 text-sm">Comprehensive Offshore Waste Collection Tracking.</p>
                    </div>
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        System Status: <span className="text-green-600 font-bold">Live</span>
                    </div>
                </header>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Assets Handled</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{entries.length} Vessels</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Revenue (USD)</p>
                        <h3 className="text-3xl font-bold text-emerald-600 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Volume Processed</p>
                        <h3 className="text-3xl font-bold text-orange-600 tracking-tighter">{totalVolume.toLocaleString()} m³</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Digitization Rate</p>
                        <h3 className="text-3xl font-bold text-blue-600 tracking-tighter">100%</h3>
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 items-end">
                    <div className="col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Vessel Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Search Vessel/IMO..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Waste Class</label>
                        <select className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm font-bold" value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
                            <option value="">All Waste Types</option>
                            <option value="sludge">Oily Sludge</option>
                            <option value="plastic">Plastic</option>
                            <option value="food">Food Waste</option>
                            <option value="hazardous">Hazardous</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">From Arrival</label>
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">To Arrival</label>
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button onClick={resetFilters} className="bg-slate-900 text-white p-2 rounded-xl font-black text-[10px] uppercase h-[40px] hover:bg-black transition">
                       <FilterX size={16} className="inline mr-2" /> Reset Audit
                    </button>
                </div>

                {/* --- PROFESSIONAL LOGISTICS TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Port/Terminal</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrival / Inspect</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waste Class</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty & Rev</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inspectors</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{entry.vesselName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono tracking-tighter">IMO: {entry.imoNumber} | {entry.vesselType || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-slate-600 text-xs font-bold uppercase">
                                                <Anchor size={12} className="mr-1 text-slate-400" /> {entry.terminal || 'Pending Berth'}
                                            </div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Charterer: {entry.chartererName || 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[11px] font-bold text-slate-700 uppercase">ARR: {entry.dateOfArrival ? new Date(entry.dateOfArrival).toLocaleDateString() : 'N/A'}</div>
                                            <div className="text-[11px] font-bold text-blue-500 uppercase">INS: {entry.dateOfInspection ? new Date(entry.dateOfInspection).toLocaleDateString() : 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                entry.wasteType === 'hazardous' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 tracking-tighter">{entry.volume} m³</div>
                                            <div className="text-sm font-black text-emerald-600 tracking-tighter">${(entry.amountMade || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {entry.nimasaInspector && <span className="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-tighter"><CheckCircle2 size={10} className="text-green-500 mr-1" /> NIMASA Verified</span>}
                                                {entry.xpoInspector && <span className="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-tighter"><CheckCircle2 size={10} className="text-green-500 mr-1" /> XPO Verified</span>}
                                                {!entry.nimasaInspector && !entry.xpoInspector && <span className="text-[9px] text-slate-300 font-bold uppercase">No Inspector Log</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                {entry.fileUrl ? (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                        <FileText size={14} />
                                                    </a>
                                                ) : (
                                                    <div className="p-2 bg-slate-100 text-slate-300 rounded-lg"><FilterX size={14} /></div>
                                                )}
                                                <button onClick={() => handleDelete(entry._id)} className="p-2 text-slate-300 border border-slate-200 rounded-lg hover:text-red-600 hover:border-red-200 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="p-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                    <Search size={40} className="text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No matching vessel records found</p>
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

export default ManagerDashboard;
