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

    const handleLogout = () => {
        if (window.confirm("Confirm logout?")) {
            localStorage.clear(); 
            window.location.href = '/login'; 
        }
    };

    const fetchEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            const url = `${API_BASE_URL}/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            const res = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
            setEntries(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
        }
    }, [API_BASE_URL, searchTerm, wasteType, startDate, endDate, navigate]);

    useEffect(() => {
        fetchEntries();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchEntries]);

    const totalRevenue = entries.reduce((acc, curr) => acc + (Number(curr.amountMade) || 0), 0);
    const totalVolume = entries.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0);
    const assessorFee = totalRevenue * 0.02;

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/manager')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg" />
                    <span className="text-lg md:text-xl font-black text-[#0089A3] uppercase tracking-tighter">ELGAN</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:block text-right border-r pr-4 border-slate-200">
                        <p className="text-xs font-bold">{userName}</p>
                        <p className="text-[9px] font-bold text-[#0089A3] uppercase tracking-widest">Admin Access</p>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"><LogOut size={20}/></button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Gross Revenue</p>
                        <h3 className="text-2xl font-bold">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-cyan-100 bg-cyan-50/20">
                        <p className="text-[#0089A3] text-[10px] font-black uppercase mb-1">2% Assessor Fee</p>
                        <h3 className="text-2xl font-bold text-[#0089A3]">${assessorFee.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Total Volume</p>
                        <h3 className="text-2xl font-bold text-orange-600">{totalVolume.toFixed(2)} m³</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Total Assets</p>
                        <h3 className="text-2xl font-bold text-[#0089A3]">{entries.length} Vessels</h3>
                    </div>
                </div>

                {/* FILTERS - Fixed select behavior */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm items-end">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Vessel Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Name/IMO..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Waste Class</label>
                        <select 
                            className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0089A3]" 
                            value={wasteType} 
                            onChange={(e) => setWasteType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="sludge">Oily Sludge</option>
                            <option value="plastic">Plastic</option>
                            <option value="garbage">Food Waste</option>
                            <option value="hazardous">Hazardous</option>
                        </select>
                    </div>
                    <input type="date" className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" className="border border-slate-200 bg-slate-50 p-2 rounded-xl text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <button onClick={() => {setSearchTerm(''); setWasteType(''); setStartDate(''); setEndDate('');}} className="bg-[#0089A3] text-white p-2 rounded-xl font-black text-[10px] uppercase h-[40px] shadow-lg shadow-cyan-100 hover:bg-[#006F85] transition-all">
                       <FilterX size={16} className="inline mr-2" /> Reset Audit
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Asset Details</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Arrival / Inspect</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Waste Class</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Qty & Rev</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/20 transition-colors">
                                        <td className="p-4">
                                            <div className="text-sm font-black text-slate-800 uppercase">{entry.vesselName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">IMO: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-4 text-[11px] font-bold">
                                            <div className="text-slate-500">ARR: {new Date(entry.dateOfArrival).toLocaleDateString()}</div>
                                            <div className="text-[#0089A3]">INS: {new Date(entry.dateOfInspection).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-cyan-50 text-[#0089A3] px-2 py-0.5 rounded text-[9px] font-black uppercase border border-cyan-100">{entry.wasteType}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-black">{entry.volume} m³</div>
                                            <div className="text-sm font-black text-[#0089A3]">${(entry.amountMade || 0).toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0089A3] text-white rounded-lg shadow-md"><FileText size={14} /></a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-center mt-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
            </main>
        </div>
    );
};

export default ManagerDashboard;
