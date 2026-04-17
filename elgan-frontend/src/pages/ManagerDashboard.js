import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, Calendar, FilterX } from 'lucide-react';

const ManagerDashboard = () => {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem('elgan_token');
            // Construct the URL with all active filters
            const url = `http://localhost:5000/api/entries/search?vesselName=${searchTerm}&wasteType=${wasteType}&startDate=${startDate}&endDate=${endDate}`;
            
            const res = await axios.get(url, { headers: { 'x-auth-token': token } });
            setEntries(res.data);
        } catch (err) {
            console.error("Filter Error:", err);
        }
    };

    // Trigger fetch whenever any filter value changes
    useEffect(() => {
        fetchEntries();
    }, [searchTerm, wasteType, startDate, endDate]);

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

            {/* ADVANCED FILTER BAR */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 items-end">
                
                {/* Search Vessel */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2">Vessel / IMO</label>
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

                {/* Waste Type */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2">Waste Category</label>
                    <select 
                        className="border p-2 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Start Date */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2">From Date</label>
                    <input 
                        type="date" 
                        className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2">To Date</label>
                    <input 
                        type="date" 
                        className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                {/* Reset Button */}
                <button 
                    onClick={resetFilters}
                    className="flex items-center justify-center bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                >
                    <FilterX size={18} className="mr-2" /> Reset
                </button>
            </div>

            {/* RESULTS LIST (Using the same table logic from before) */}
            {/* ... table code goes here ... */}
        </div>
    );
};