import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Search, FileText, FilterX, LogOut, CheckCircle2, 
    DollarSign, Ship, Anchor, Download, Eye, LayoutDashboard,
    ClipboardList, TrendingUp
} from 'lucide-react';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [financials, setFinancials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userName, setUserName] = useState('Operational Manager');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleLogout = () => {
        if (window.confirm("Confirm logout from Elgan System?")) {
            localStorage.clear(); 
            window.location.href = '/login'; 
        }
    };

    const fetchAllData = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            // Fetch Entries with current filters
            const url = `${API_BASE_URL}/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            const resEntries = await axios.get(url, config);
            setEntries(Array.isArray(resEntries.data) ? resEntries.data : []);

            // Fetch Financial Reports
            const resFin = await axios.get(`${API_BASE_URL}/api/financials/all`, config);
            setFinancials(Array.isArray(resFin.data) ? resFin.data : []);

        } catch (err) {
            if (err.response?.status === 401) navigate('/login');
        }
    }, [API_BASE_URL, searchTerm, wasteType, startDate, endDate, navigate]);

    useEffect(() => {
        fetchAllData();
        const storedName = localStorage.getItem('elgan_user_name');
        if (storedName) setUserName(storedName);
    }, [fetchAllData]);

    // CALCULATIONS
    const totalRevenue = entries.reduce((acc, curr) => acc + (Number(curr.amountMade) || 0), 0);
    const totalVolume = entries.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0);
    const assessorFeeTotal = totalRevenue * 0.02;

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- NAVIGATION --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/manager')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg shadow-sm border border-slate-100" />
                    <span className="text-xl font-black text-[#0089A3] tracking-tighter uppercase">ELGAN <span className="text-slate-400 font-light">HQ</span></span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col text-right border-r pr-6 border-slate-200">
                        <p className="text-sm font-bold text-slate-800">{userName}</p>
                        <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-[0.2em]">Executive Manager</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-red-500 transition-all font-bold text-sm">
                        <LogOut size={20} className="mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1700px] mx-auto">
                
                {/* --- EXECUTIVE COMMAND BAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                            <LayoutDashboard className="mr-2 text-[#0089A3]" /> Management Console
                        </h2>
                        <p className="text-slate-500 text-xs font-medium">Real-time surveillance & financial auditing.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-slate-800 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center">
                            <Download size={16} className="mr-2" /> Export Audit (CSV)
                        </button>
                    </div>
                </div>

                {/* --- ANALYTICS PANEL --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <TrendingUp className="absolute -right-4 -bottom-4 text-slate-50 size-24 group-hover:text-cyan-50 transition-all" />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Managed Revenue</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-[#0089A3] p-6 rounded-2xl shadow-xl shadow-cyan-100 relative overflow-hidden">
                        <DollarSign className="absolute -right-4 -bottom-4 text-white/10 size-24" />
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Accrued 2% Fee</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter">${assessorFeeTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Operational Volume</p>
                        <h3 className="text-3xl font-black text-orange-600 tracking-tighter">{totalVolume.toFixed(2)} <span className="text-sm">m³</span></h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Fleet Inspection Count</p>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{entries.length} <span className="text-sm">Assets</span></h3>
                    </div>
                </div>

                {/* --- COMMAND FILTERS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm items-end">
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Asset Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-[#0089A3]" size={16} />
                            <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0089A3] outline-none" placeholder="Vessel Name / IMO" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Waste Stream</label>
                        <select className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0089A3]" value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="sludge">Oily Sludge</option>
                            <option value="plastic">Plastic</option>
                            <option value="garbage">Garbage</option>
                            <option value="hazardous">Hazardous</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:col-span-2">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">From</label>
                            <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-bold" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">To</label>
                            <input type="date" className="w-full border border-slate-200 bg-slate-50 p-2 rounded-xl text-xs font-bold" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={() => {setSearchTerm(''); setWasteType(''); setStartDate(''); setEndDate('');}} className="bg-slate-100 text-slate-500 p-2.5 rounded-xl font-black text-[10px] uppercase h-[42px] hover:bg-slate-200 transition-all flex items-center justify-center">
                       <FilterX size={16} className="mr-2" /> Reset
                    </button>
                </div>

                {/* --- DETAILED OPERATIONAL HISTORY --- */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center">
                        <Ship size={18} className="mr-2 text-[#0089A3]" />
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Operational Log Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-5 font-black">Asset & IMO</th>
                                    <th className="p-5 font-black">Agent Name</th>
                                    <th className="p-5 font-black">Terminal</th>
                                    <th className="p-5 font-black">MCI Number</th>
                                    <th className="p-5 font-black">Volume (m³)</th>
                                    <th className="p-5 font-black">Verification</th>
                                    <th className="p-5 font-black text-right">Executive Command</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {entries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/20 transition-colors group text-xs font-bold uppercase">
                                        <td className="p-5">
                                            <div className="text-slate-800">{entry.vesselName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono lowercase">imo: {entry.imoNumber}</div>
                                        </td>
                                        <td className="p-5 text-slate-500">{entry.agentName || 'N/A'}</td>
                                        <td className="p-5 text-slate-500"><Anchor size={12} className="inline mr-1" />{entry.terminal}</td>
                                        <td className="p-5 text-[#0089A3]">{entry.mciNumber || 'N/A'}</td>
                                        <td className="p-5 text-slate-800">{entry.volume} m³</td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                {entry.nimasaInspector && <span className="flex items-center text-[9px] text-emerald-600"><CheckCircle2 size={10} className="mr-1" /> NIMASA</span>}
                                                {entry.xpoInspector && <span className="flex items-center text-[9px] text-emerald-600"><CheckCircle2 size={10} className="mr-1" /> XPO</span>}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#0089A3] hover:text-white transition-all"><Eye size={16} /></button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-[#0089A3] rounded-lg hover:bg-[#0089A3] hover:text-white transition-all">
                                                        <FileText size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FINANCIAL AUDIT HISTORY --- */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-900 flex items-center justify-between text-white">
                        <div className="flex items-center">
                            <ClipboardList size={18} className="mr-2 text-[#0089A3]" />
                            <h3 className="font-black text-xs uppercase tracking-widest">Financial Audit History</h3>
                        </div>
                        <span className="text-[10px] font-black bg-white/10 px-4 py-1 rounded-full uppercase tracking-widest">Monthly Reports</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-5 font-black">Reporting Period</th>
                                    <th className="p-5 font-black">Gross Revenue</th>
                                    <th className="p-5 font-black text-[#0089A3]">2% Assessor Fee</th>
                                    <th className="p-5 font-black text-right">Log Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-bold uppercase text-slate-700">
                                {financials.length > 0 ? financials.map((fin) => (
                                    <tr key={fin._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5">{fin.reportMonth}</td>
                                        <td className="p-5">${Number(fin.totalIncome).toLocaleString()}</td>
                                        <td className="p-5 text-[#0089A3]">${Number(fin.assessorFee).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="p-5 text-right">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-emerald-100">Audited & Logged</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No financial records detected.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
            </main>
        </div>
    );
};

export default ManagerDashboard;
