import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, FileText, FilterX, ExternalLink } from 'lucide-react';

const ManagerDashboard = () => {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // useCallback prevents the "missing dependency" warning and infinite loops
    const fetchEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            const url = `${API_BASE_URL}/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            
            const res = await axios.get(url, { 
                headers: { 'x-auth-token': token } 
            });
            setEntries(res.data);
        } catch (err) {
            console.error("Audit Fetch Error:", err);
        }
    }, [API_BASE_URL, searchTerm, wasteType, startDate, endDate]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const resetFilters = () => {
        setSearchTerm('');
        setWasteType('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Compliance & Audit Hub</h1>
                <p className="text-slate-500 font-medium">Search digitized manifests and original paper records</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 items-end">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Vessel / IMO</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="e.g. ELGAN EXPLORER" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Waste Category</label>
                    <select 
                        className="w-full border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="sludge">Oily Sludge</option>
                        <option value="plastic">Plastic</option>
                        <option value="food">Food Waste</option>
                        <option value="hazardous">Hazardous</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">From Date</label>
                    <input 
                        type="date" 
                        className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">To Date</label>
                    <input 
                        type="date" 
                        className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <button 
                    onClick={resetFilters}
                    className="flex items-center justify-center bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition font-medium text-sm h-[38px]"
                >
                    <FilterX size={18} className="mr-2" /> Reset Filters
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Vessel Name</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Waste Type</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Quantity</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Manifest</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {entries.length > 0 ? entries.map((entry) => (
                            <tr key={entry._id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-4 text-sm text-slate-600">
                                    {new Date(entry.date).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-sm font-semibold text-slate-800 uppercase">{entry.vesselName}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                                        {entry.wasteType}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-medium text-slate-700">{entry.quantity} {entry.unit}</td>
                                <td className="p-4 text-center">
                                    {entry.manifestUrl ? (
                                        <a href={entry.manifestUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                                            <FileText size={16} className="mr-1" /> View PDF <ExternalLink size={12} className="ml-1" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">No scan</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400 italic">No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerDashboard;