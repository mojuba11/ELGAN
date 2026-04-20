import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ship, FilePlus, ArrowLeft } from 'lucide-react'; // Removed unused Calendar and UserCheck

const EntryForm = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        vesselName: '',
        vesselType: '',
        imoNumber: '',
        mciNumber: '',
        terminal: '',
        chartererName: '',
        wasteType: 'sludge',
        volume: '',
        dateOfArrival: '',
        dateOfInspection: '',
        nimasaInspector: false,
        xpoInspector: false
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('elgan_token');

        // FormData is required for file uploads and mixed data types
        const data = new FormData();
        
        // We append the text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        // We append the file - naming it 'manifestScan' to match backend route
        if (file) {
            data.append('manifestScan', file);
        }

        try {
            await axios.post(`${API_BASE_URL}/api/entries/add`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Manifest Digitized & Saved Successfully!");
            navigate('/fleet');
        } catch (err) {
            console.error("Submission error:", err);
            alert("Submission Failed. Ensure you are logged in and all required fields are filled.");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <Ship size={28} />
                        <h2 className="text-2xl font-black uppercase tracking-tighter">New Waste Manifest</h2>
                    </div>
                    <button onClick={() => navigate('/fleet')} className="text-blue-100 hover:text-white flex items-center text-sm font-bold transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Log
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vessel Details */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Vessel Information</h3>
                        <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="vesselType" placeholder="Vessel Type" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            <input name="imoNumber" placeholder="IMO Number" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                        <input name="mciNumber" placeholder="MCI Number" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        <input name="chartererName" placeholder="Charterer Name" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Logistics & Compliance</h3>
                        <input name="terminal" placeholder="Terminal / Berth" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Arrival Date</label>
                                <input type="date" name="dateOfArrival" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Inspection Date</label>
                                <input type="date" name="dateOfInspection" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <label className="flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                                <input type="checkbox" name="nimasaInspector" onChange={handleChange} className="mr-2 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /> NIMASA Inspector
                            </label>
                            <label className="flex items-center text-xs font-bold text-slate-600 cursor-pointer">
                                <input type="checkbox" name="xpoInspector" onChange={handleChange} className="mr-2 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /> XPO Inspector
                            </label>
                        </div>
                    </div>

                    {/* Waste Details & File */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-inner">
                        <div>
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Waste Category</label>
                            <select name="wasteType" onChange={handleChange} value={formData.wasteType} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all">
                                <option value="sludge">Sludge</option>
                                <option value="plastic">Plastic</option>
                                <option value="garbage">Garbage</option>
                                <option value="n/a">N/A</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Metric Volume (m³)</label>
                            <input name="volume" type="number" step="0.01" placeholder="0.00" onChange={handleChange} required className="w-full p-3 bg-white border border-blue-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Scan Manifest (PDF/IMG)</label>
                            <input type="file" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer" />
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center shadow-lg active:scale-95">
                        <FilePlus className="mr-2" size={20} /> Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EntryForm;
