import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Search, FileText, FilterX, LogOut, 
    Download, Eye, LayoutDashboard,
    ClipboardList, X
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

    // Modal State
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            
            const url = `${API_BASE_URL}/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            const resEntries = await axios.get(url, config);
            setEntries(Array.isArray(resEntries.data) ? resEntries.data : []);

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

    const handleViewDetails = (entry) => {
        setSelectedEntry(entry);
        setShowModal(true);
    };

    // CALCULATIONS
    const totalRevenue = entries.reduce((acc, curr) => acc + (Number(curr.amountMade) || 0), 0);
    const totalVolume = entries.reduce((acc, curr) => acc + (Number(curr.volume) || 0), 0);
    const assessorFeeTotal = totalRevenue * 0.02;

    // LIMIT TO TOP 5 ENTRIES FOR THE TABLE PREVIEW
    const displayedEntries = entries.slice(0, 5);

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* --- NAVIGATION --- */}
            <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/manager')}>
                    <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto rounded-lg shadow-sm" />
                    <span className="text-xl font-black text-[#0089A3] tracking-tighter uppercase">ELGAN HQ</span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="hidden sm:flex flex-col text-right border-r pr-6 border-slate-200">
                        <p className="text-sm font-bold text-slate-800">{userName}</p>
                        <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-[0.2em]">Executive Manager</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-all font-bold text-sm">
                        <LogOut size={20} className="mr-2" /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-[1800px] mx-auto">
                
                {/* --- EXECUTIVE COMMAND BAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center uppercase">
                            <LayoutDashboard className="mr-2 text-[#0089A3]" /> Executive Console
                        </h2>
                        <p className="text-slate-500 text-xs font-medium">Certified Surveillance & Operational Audit.</p>
                    </div>
                    <button className="bg-slate-800 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center">
                        <Download size={16} className="mr-2" /> Export Fleet Audit
                    </button>
                </div>

                {/* --- ANALYTICS PANEL --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Gross Revenue</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-[#0089A3] p-6 rounded-2xl shadow-xl shadow-cyan-100 text-white">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Total 2% Assessor Fee</p>
                        <h3 className="text-3xl font-black tracking-tighter">${assessorFeeTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Operational Volume</p>
                        <h3 className="text-3xl font-black text-orange-600 tracking-tighter">{totalVolume.toFixed(2)} m³</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Inspections</p>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{entries.length} Assets</h3>
                    </div>
                </div>

                {/* --- FILTERS --- */}
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
                       <FilterX size={16} className="mr-2" /> Clear Audit
                    </button>
                </div>

                {/* --- SEPARATED OPERATIONAL LOG TABLE (TOP 5) --- */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 font-black text-slate-800 text-sm uppercase flex justify-between items-center">
                       <span>Recent Fleet Operational History</span>
                       <span className="text-[10px] bg-cyan-100 text-[#0089A3] px-3 py-1 rounded-full">Displaying Latest 5</span>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-5 font-black border-r border-slate-100">Vessel Name</th>
                                    <th className="p-5 font-black border-r border-slate-100">IMO Number</th>
                                    <th className="p-5 font-black border-r border-slate-100">Arrival Date</th>
                                    <th className="p-5 font-black border-r border-slate-100">MCI Number</th>
                                    <th className="p-5 font-black border-r border-slate-100">Inspection Date</th>
                                    <th className="p-5 font-black border-r border-slate-100">Terminal</th>
                                    <th className="p-5 font-black border-r border-slate-100">Agent Name</th>
                                    <th className="p-5 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {displayedEntries.length > 0 ? displayedEntries.map((entry) => (
                                    <tr key={entry._id} className="hover:bg-cyan-50/20 transition-colors group text-xs font-bold uppercase text-slate-700">
                                        <td className="p-5 text-[#0089A3] font-black border-r border-slate-50">{entry.vesselName}</td>
                                        <td className="p-5 font-mono border-r border-slate-50">{entry.imoNumber}</td>
                                        <td className="p-5 border-r border-slate-50">{entry.dateOfArrival || entry.arrivalDate || 'N/A'}</td>
                                        <td className="p-5 border-r border-slate-50">{entry.mciNumber || entry.mciNo || 'N/A'}</td>
                                        <td className="p-5 text-orange-600 border-r border-slate-50">{entry.dateOfInspection || 'Pending'}</td>
                                        <td className="p-5 border-r border-slate-50">{entry.terminal}</td>
                                        <td className="p-5 border-r border-slate-50">{entry.agentName || 'Not Assigned'}</td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleViewDetails(entry)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#0089A3] hover:text-white transition-all"><Eye size={16} /></button>
                                                {entry.fileUrl && (
                                                    <a href={`${API_BASE_URL}/uploads/${entry.fileUrl}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-[#0089A3] rounded-lg hover:bg-[#0089A3] hover:text-white transition-all">
                                                        <FileText size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8" className="p-10 text-center text-slate-400 uppercase text-xs font-bold">No entries found.</td></tr>
                                )}
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
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                    <th className="p-5 font-black">Reporting Period</th>
                                    <th className="p-5 font-black">Gross Revenue</th>
                                    <th className="p-5 font-black text-[#0089A3]">2% Assessor Fee</th>
                                    <th className="p-5 font-black text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-bold uppercase text-slate-700">
                                {financials.length > 0 ? financials.map((fin) => (
                                    <tr key={fin._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-5">{fin.reportMonth}</td>
                                        <td className="p-5">${Number(fin.totalIncome).toLocaleString()}</td>
                                        <td className="p-5 text-[#0089A3]">${Number(fin.assessorFee).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="p-5 text-right">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-emerald-100 tracking-widest">Verified</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
            </main>

            {/* --- DETAILS MODAL --- */}
            {showModal && selectedEntry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#0089A3] p-8 flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Management Audit</h2>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-2">Full Vessel Manifest Archive</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"><X size={24} /></button>
                        </div>
                        <div className="p-10 grid grid-cols-2 gap-y-8 gap-x-12 text-sm uppercase border-b border-slate-50">
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Vessel Name</p><p className="font-black text-slate-800 text-lg">{selectedEntry.vesselName}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">IMO Number</p><p className="font-bold text-slate-800">{selectedEntry.imoNumber}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Agent Name</p><p className="font-bold text-slate-800">{selectedEntry.agentName || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">MCI Number</p><p className="font-bold text-slate-800">{selectedEntry.mciNumber || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Arrival Date</p><p className="font-bold text-slate-800">{selectedEntry.dateOfArrival || 'N/A'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Inspection Date</p><p className="font-bold text-orange-600">{selectedEntry.dateOfInspection || 'Pending'}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Terminal / Berth</p><p className="font-bold text-slate-800">{selectedEntry.terminal}</p></div>
                            <div><p className="text-[10px] text-slate-400 font-black mb-1 tracking-widest">Waste Category</p><p className="font-black text-[#0089A3]">{selectedEntry.wasteType}</p></div>
                        </div>
                        <div className="px-10 py-6 bg-slate-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-[10px] text-slate-400 font-black uppercase">Waste Volume</p>
                                <p className="text-2xl font-black text-slate-800">{selectedEntry.volume} m³</p>
                            </div>
                            <div className="flex space-x-3">
                                {selectedEntry.fileUrl && (
                                    <a href={`${API_BASE_URL}/uploads/${selectedEntry.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center bg-[#0089A3] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#006F85] transition-all">
                                        <Download size={14} className="mr-2" /> Manifest
                                    </a>
                                )}
                                <button onClick={() => setShowModal(false)} className="bg-slate-200 text-slate-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
