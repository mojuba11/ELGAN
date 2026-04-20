import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ship, Anchor, FilePlus, ArrowLeft, Loader2, CheckCircle, DollarSign } from 'lucide-react';

const EntryForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
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
        amountMade: '', // Added to sync with Dashboard calculations
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
        setIsLoading(true);
        
        const token = localStorage.getItem('elgan_token');

        if (!token) {
            alert("Session Expired. Please log in again.");
            navigate('/login');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
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
            console.error("Submission error details:", err.response?.data);
            if (err.response?.status === 401) {
                alert("Authorization Denied. Redirecting to login...");
                localStorage.clear();
                navigate('/login');
            } else {
                alert(err.response?.data?.msg || "Submission Failed. Check required fields.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* --- BRANDED HEADER --- */}
                <div className="bg-[#0089A3] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <img src="/elgan.jpeg" alt="Logo" className="h-10 w-auto bg-white rounded-lg p-1" />
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none text-white">New Asset Log</h2>
                            <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest mt-1">Operational Manifest Entry</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/fleet')} 
                        className="text-white/80 hover:text-white flex items-center text-xs font-bold transition-colors uppercase tracking-widest bg-white/10 px-3 py-2 rounded-lg"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    
                    {/* Vessel Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[#0089A3] font-black text-[10px] uppercase tracking-[0.2em] border-b border-cyan-50 pb-2 flex items-center">
                                <Ship size={14} className="mr-2" /> Vessel Identification
                            </h3>
                            <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="vesselType" placeholder="Vessel Type" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                                <input name="imoNumber" placeholder="IMO Number" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                            </div>
                            <input name="mciNumber" placeholder="MCI Number" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[#0089A3] font-black text-[10px] uppercase tracking-[0.2em] border-b border-cyan-50 pb-2 flex items-center">
                                <Anchor size={14} className="mr-2" /> Logistics & Compliance
                            </h3>
                            <input name="terminal" placeholder="Terminal / Berth" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                            <input name="chartererName" placeholder="Charterer Name" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 placeholder:font-normal" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest ml-1">Arrival Date</label>
                                    <input type="date" name="dateOfArrival" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-widest ml-1">Inspection Date</label>
                                    <input type="date" name="dateOfInspection" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Metrics Section */}
                    <div className="bg-cyan-50/50 p-6 md:p-8 rounded-3xl border border-cyan-100">
                        <h3 className="text-[#0089A3] font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center">
                            <CheckCircle size={14} className="mr-2" /> Operational Metrics & Billing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Waste Category</label>
                                <select name="wasteType" onChange={handleChange} value={formData.wasteType} className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]">
                                    <option value="sludge">Oily Sludge</option>
                                    <option value="plastic">Plastic Waste</option>
                                    <option value="garbage">General Garbage</option>
                                    <option value="hazardous">Hazardous</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Volume (m³)</label>
                                <input name="volume" type="number" step="0.01" placeholder="0.00" onChange={handleChange} required className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-black text-xl text-[#0089A3] outline-none focus:ring-2 focus:ring-[#0089A3]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1 text-emerald-600">Total Revenue (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-4 text-emerald-500" size={20} />
                                    <input name="amountMade" type="number" placeholder="0.00" onChange={handleChange} required className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-200 rounded-2xl font-black text-xl text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Inspector Checkboxes */}
                        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-cyan-100">
                             <label className="flex items-center text-xs font-black text-slate-600 cursor-pointer uppercase tracking-widest">
                                <input type="checkbox" name="nimasaInspector" onChange={handleChange} className="mr-3 w-5 h-5 text-[#0089A3] rounded-lg border-cyan-200 focus:ring-[#0089A3]" /> NIMASA Verified
                            </label>
                            <label className="flex items-center text-xs font-black text-slate-600 cursor-pointer uppercase tracking-widest">
                                <input type="checkbox" name="xpoInspector" onChange={handleChange} className="mr-3 w-5 h-5 text-[#0089A3] rounded-lg border-cyan-200 focus:ring-[#0089A3]" /> XPO Verified
                            </label>
                        </div>
                    </div>

                    {/* File Attachment */}
                    <div className="group relative border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center bg-slate-50 hover:bg-white hover:border-[#0089A3] transition-all cursor-pointer">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center">
                            <FilePlus className="text-slate-300 group-hover:text-[#0089A3] transition-colors mb-2" size={40} />
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700">Attach Digital Manifest (PDF/JPG)</p>
                            {file && <p className="mt-4 text-sm font-black text-[#0089A3] bg-cyan-50 px-4 py-1 rounded-full uppercase border border-cyan-100">Selected: {file.name}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#006F85] transition-all flex items-center justify-center shadow-lg shadow-cyan-100 disabled:bg-slate-300 active:scale-95 text-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>Authorize & Digitization Entry</>
                        )}
                    </button>
                </form>
            </div>
            
            <p className="text-center mt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                © 2026 Elgan integrated Ltd.
            </p>
        </div>
    );
};

export default EntryForm;
