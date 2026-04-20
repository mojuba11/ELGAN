import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Search, FileText, FilterX, 
    LogOut, User, Trash2, Anchor, CheckCircle2, DollarSign 
} from 'lucide-react';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userName, setUserName] = useState('Operational Manager');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // --- SECURE MOBILE-FRIENDLY LOGOUT ---
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.clear(); 
            navigate('/login');
            window.location.href = '/login'; 
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
            if (err.response?.status === 401) navigate('/login');
        }
    }, [API_BASE_URL, searchTerm, wasteType, startDate, endDate, navigate]);

    useEffect(() => {
        fetchEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchEntries]);

    const handleDelete = async (id) => {
        if (window.confirm("CRITICAL: Are you sure you want to delete this record?")) {
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

    // --- CALCULATIONS ---
    const totalRevenue = entries.reduce((acc, curr) => acc + (curr.amountMade || 0), 0);
    const totalVolume = entries.reduce((acc, curr) => acc + (curr.volume || 0), 0);
    const assessorFee = totalRevenue * 0.02; // 2% Fee Calculation

    const resetFilters = () => {
        setSearchTerm('');
        setWasteType('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* --- EXECUTIVE TOP BAR --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/manager')}>
                    {/* Logo Integration */}
                    <img 
                        src="/elgan.jpeg" 
                        alt="ELGAN" 
                        className="h-10 w-auto rounded-lg shadow-sm border border-slate-100" 
                    />
                    <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                        ELGAN <span className="hidden md:inline text-blue-600 uppercase">Operations</span>
                    </span>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-6">
                    <div className="hidden sm:flex items-center space-x-3 border-r pr-4 border-slate-200">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{userName}</p>
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest text-right">Admin Access</p>
                        </div>
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600 border border-slate-200">
                            <User size={18} />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center justify-center bg-red-50 md:bg-transparent text-red-600 md:text-slate-500 hover:text-red-700 p-2 md:p-0 rounded-lg transition-colors font-bold text-sm"
                    >
                        <LogOut size={20} className="md:mr-2" /> 
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Compliance & Audit Hub</h1>
                        <p className="text-slate-500 mt-1 font-medium italic underline decoration-blue-200 decoration-4 text-xs md:text-sm">Comprehensive Offshore Waste Collection Tracking.</p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        System Status: <span className="text-green-600 font-bold">Live</span>
                    </div>
                </header>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Gross Revenue</p>
                        <h3 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-emerald-100 bg-emerald-50/30">
                        <p className="text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 flex items-center">
                            <DollarSign size={10} className="mr-1"/> 2% Assessor Fee
                        </p>
                        <h3 className="text-xl md:text-3xl font-bold text-emerald-600 tracking-tighter">
                            ${assessorFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </h3>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Volume</p>
                        <h3 className="text-xl md:text-3xl font-bold text-orange-600 tracking-tighter">{totalVolume.toLocaleString()} m³</h3>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Total Assets</p>
                        <h3 className="text-xl md:text-3xl font-bold text-blue-600 tracking-tighter">{entries.length} Vessels</h3>
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 items-end">
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Vessel Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Name/IMO..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm font-bold" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">To Arrival</label>
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm font-bold" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button onClick={resetFilters} className="bg-slate-900 text-white p-2 rounded-xl font-black text-[10px] uppercase h-[40px] hover:bg-black transition shadow-lg active:scale-95">
                       <FilterX size={16} className="inline mr-2" /> Reset Audit
                    </button>
                </div>

                {/* --- TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
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
                                            <div className="text-[10px] text-slate-400 font-mono tracking-tighter">IMO: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-4 text-xs font-bold text-slate-600 uppercase">
                                            <Anchor size={12} className="inline mr-1 text-slate-400" /> {entry.terminal || 'Pending'}
                                        </td>
                                        <td className="p-4 text-[11px] font-bold text-slate-700 uppercase">
                                            <div>ARR: {entry.dateOfArrival ? new Date(entry.dateOfArrival).toLocaleDateString() : 'N/A'}</div>
                                            <div className="text-blue-500 uppercase">INS: {entry.dateOfInspection ? new Date(entry.dateOfInspection).toLocaleDateString() : 'N/A'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                entry.wasteType === 'hazardous' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800">{entry.volume} m³</div>
                                            <div className="text-sm font-black text-emerald-600">${(entry.amountMade || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {entry.nimasaInspector && <span className="flex items-center text-[9px] font-black text-slate-500 uppercase"><CheckCircle2 size={10} className="text-green-500 mr-1" /> NIMASA</span>}
                                                {entry.xpoInspector && <span className="flex items-center text-[9px] font-black text-slate-500 uppercase"><CheckCircle2 size={10} className="text-green-500 mr-1" /> XPO</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                        <FileText size={14} />
                                                    </a>
                                                )}
                                                <button onClick={() => handleDelete(entry._id)} className="p-2 text-slate-300 border border-slate-200 rounded-lg hover:text-red-600 hover:border-red-200 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="p-24 text-center text-slate-400 uppercase text-xs font-bold tracking-widest">No matching records.</td></tr>
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
