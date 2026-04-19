import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ship, Calendar, UserCheck, FilePlus, ArrowLeft } from 'lucide-react';

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

        // FormData is required for file uploads
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('manifestFile', file);

        try {
            await axios.post(`${API_BASE_URL}/api/entries`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Manifest Digitized & Saved Successfully!");
            navigate('/fleet');
        } catch (err) {
            alert("Submission Failed. Ensure all fields are filled.");
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
                    <button onClick={() => navigate('/fleet')} className="text-blue-100 hover:text-white flex items-center text-sm font-bold">
                        <ArrowLeft size={16} className="mr-1" /> Back to Log
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vessel Details */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Vessel Information</h3>
                        <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="vesselType" placeholder="Vessel Type" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                            <input name="imoNumber" placeholder="IMO Number" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                        </div>
                        <input name="mciNumber" placeholder="MCI Number" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                        <input name="chartererName" placeholder="Charterer Name" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>

                    {/* Operational Details */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest border-b pb-2">Logistics & Compliance</h3>
                        <input name="terminal" placeholder="Terminal / Berth" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">ARRIVAL DATE</label>
                                <input type="date" name="dateOfArrival" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">INSPECTION DATE</label>
                                <input type="date" name="dateOfInspection" onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 p-3 bg-slate-50 rounded-xl border">
                            <label className="flex items-center text-xs font-bold text-slate-600">
                                <input type="checkbox" name="nimasaInspector" onChange={handleChange} className="mr-2 w-4 h-4 text-blue-600" /> NIMASA
                            </label>
                            <label className="flex items-center text-xs font-bold text-slate-600">
                                <input type="checkbox" name="xpoInspector" onChange={handleChange} className="mr-2 w-4 h-4 text-blue-600" /> XPO
                            </label>
                        </div>
                    </div>

                    {/* Waste Details & File */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div>
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Waste Category</label>
                            <select name="wasteType" onChange={handleChange} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-bold text-slate-700">
                                <option value="sludge">Oily Sludge</option>
                                <option value="plastic">Plastic</option>
                                <option value="food">Food Waste</option>
                                <option value="hazardous">Hazardous</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Metric Volume (m³)</label>
                            <input name="volume" type="number" placeholder="0.00" onChange={handleChange} required className="w-full p-3 bg-white border border-blue-200 rounded-xl font-bold" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Scan Manifest (PDF)</label>
                            <input type="file" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center">
                        <FilePlus className="mr-2" size={20} /> Finalize & Digitized Manifest
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EntryForm;
