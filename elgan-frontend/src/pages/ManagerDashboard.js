import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Search, FileText, FilterX, ExternalLink, 
    LogOut, User, BarChart3, Ship, Trash2, DollarSign, AlertCircle
} from 'lucide-react';

const ManagerDashboard = () => {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userName, setUserName] = useState('Operational Manager');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Logout Functionality
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('elgan_token');
            localStorage.removeItem('elgan_user_name'); // Clear user name if stored
            window.location.href = '/login';
        }
    };

    // Fetch Entries with Search/Filter parameters
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
        // Set dynamic user name if available
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchEntries]);

    // Handle Entry Deletion (New Executive Feature)
    const handleDelete = async (id) => {
        if (window.confirm("CRITICAL: Are you sure you want to delete this record? This cannot be undone.")) {
            try {
                const token = localStorage.getItem('elgan_token');
                await axios.delete(`${API_BASE_URL}/api/entries/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchEntries(); // Refresh list
            } catch (err) {
                alert("Error deleting record. Check permissions.");
            }
        }
    };

    // Derived Statistics
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
            {/* --- EXECUTIVE TOP BAR --- */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BarChart3 className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">ELGAN <span className="text-blue-600">OSM</span></span>
                </div>
                
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 border-r pr-6 border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{userName}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Administrator</p>
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

            <main className="p-8 max-w-7xl mx-auto">
                {/* --- HEADER --- */}
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance & Audit Hub</h1>
                        <p className="text-slate-500 mt-1 font-medium">Monitoring offshore waste logistics and financial compliance.</p>
                    </div>
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        System Status: <span className="text-green-600 font-bold underline">Live</span>
                    </div>
                </header>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Ship size={24} /></div>
                            <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">LIVE FEED</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Entries</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{entries.length}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={24} /></div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue (USD)</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Trash2 size={24} /></div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Volume Processed</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{totalVolume.toLocaleString()} m³</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FileText size={24} /></div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Compliance Rate</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">100%</h3>
                    </div>
                </div>

                {/* --- FILTERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 items-end shadow-indigo-100/20">
                    <div className="col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vessel / IMO Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300" 
                                placeholder="Search Vessel..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Waste Category</label>
                        <select 
                            className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                            value={wasteType}
                            onChange={(e) => setWasteType(e.target.value)}
                        >
                            <option value="">All Waste Types</option>
                            <option value="sludge">Oily Sludge</option>
                            <option value="plastic">Plastic</option>
                            <option value="food">Food Waste</option>
                            <option value="hazardous">Hazardous</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Start Date</label>
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm outline-none text-slate-600" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">End Date</label>
                        <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm outline-none text-slate-600" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>

                    <button 
                        onClick={resetFilters}
                        className="flex items-center justify-center bg-slate-900 text-white p-2 rounded-xl hover:bg-black transition shadow-lg shadow-slate-200 font-black text-[10px] uppercase tracking-widest h-[40px]"
                    >
                        <FilterX size={16} className="mr-2" /> Reset Audit
                    </button>
                </div>

                {/* --- TRANSACTION TABLE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-black text-slate-800 text-sm uppercase tracking-tighter flex items-center">
                           <AlertCircle size={16} className="mr-2 text-blue-600" /> Recent Digital Records
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entries.length} Entries Filtered</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vessel Asset</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric Vol.</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Revenue</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 text-xs font-bold text-slate-500 italic">
                                            {entry.entryDate ? new Date(entry.entryDate).toLocaleDateString() : 'Pending'}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tighter">{entry.vesselName}</div>
                                            <div className="text-[9px] text-slate-400 font-mono italic tracking-tighter">IMO: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                entry.wasteType === 'hazardous' 
                                                ? 'bg-red-50 text-red-600 border-red-100' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {entry.wasteType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-700">{entry.volume} m³</td>
                                        <td className="p-4 text-sm font-black text-emerald-600 tracking-tighter">
                                            ${(entry.amountMade || 0).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                {entry.fileUrl ? (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-100">
                                                        <FileText size={14} />
                                                    </a>
                                                ) : (
                                                    <div className="p-2 bg-slate-100 text-slate-300 rounded-lg"><FilterX size={14} /></div>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(entry._id)}
                                                    className="p-2 bg-white text-slate-300 border border-slate-200 rounded-lg hover:text-red-600 hover:border-red-200 transition group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                    <Search size={40} className="text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No matching audit trails found</p>
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
