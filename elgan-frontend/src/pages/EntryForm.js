import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ship, Anchor, FilePlus, ArrowLeft, Loader2, CheckCircle, DollarSign } from 'lucide-react';

const EntryForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        vesselName: '', vesselType: '', imoNumber: '', mciNumber: '', terminal: '', chartererName: '',
        wasteType: 'sludge', volume: '', amountMade: '', dateOfArrival: '', dateOfInspection: '',
        nimasaInspector: false, xpoInspector: false
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('elgan_token');
        if (!token) {
            alert("No session detected. Please log in.");
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Get token and clean it
        const token = localStorage.getItem('elgan_token');
        if (!token) {
            alert("Session expired. Please log in again.");
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);

        // 2. Prepare Multipart Data
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (file) data.append('manifestScan', file);

        try {
            // 3. Precise Axios Call
            await axios.post(`${API_BASE_URL}/api/entries/add`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`, // No extra quotes
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            alert("Success! Entry has been recorded.");
            navigate('/fleet');
        } catch (err) {
            console.error("Submission Error Status:", err.response?.status);
            
            if (err.response?.status === 401) {
                alert("Your session has expired or is invalid. Logging out...");
                localStorage.clear();
                window.location.href = '/login';
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
                <div className="bg-[#0089A3] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <img src="/elgan.jpeg" alt="Logo" className="h-10 w-auto bg-white rounded-lg p-1" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Asset Entry</h2>
                    </div>
                    <button onClick={() => navigate('/fleet')} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
                        <ArrowLeft size={16} className="inline mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Ship size={14} className="mr-2 text-[#0089A3]" /> Vessel Details
                            </label>
                            <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold" />
                            <input name="imoNumber" placeholder="IMO Number" onChange={handleChange} required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Anchor size={14} className="mr-2 text-[#0089A3]" /> Location Details
                            </label>
                            <input name="terminal" placeholder="Terminal" onChange={handleChange} required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" name="dateOfArrival" onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" />
                                <input type="date" name="dateOfInspection" onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-2xl text-xs font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-cyan-50/50 p-6 rounded-3xl border border-cyan-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Category</label>
                            <select name="wasteType" onChange={handleChange} value={formData.wasteType} className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#0089A3]">
                                <option value="sludge">Oily Sludge</option>
                                <option value="plastic">Plastic</option>
                                <option value="garbage">Garbage</option>
                                <option value="hazardous">Hazardous</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Qty (m³)</label>
                            <input name="volume" type="number" step="0.01" placeholder="0.00" onChange={handleChange} required className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-black text-[#0089A3] outline-none focus:ring-2 focus:ring-[#0089A3]" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-emerald-600 uppercase block mb-2 ml-1">Revenue (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-4 text-emerald-500" size={20} />
                                <input name="amountMade" type="number" placeholder="0.00" onChange={handleChange} required className="w-full pl-10 p-4 bg-white border border-emerald-200 rounded-2xl font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="group relative border-2 border-dashed border-slate-200 p-8 rounded-3xl text-center hover:border-[#0089A3] transition-all bg-slate-50">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <FilePlus className="text-slate-300 mx-auto mb-2" size={40} />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Manifest Scan</p>
                        {file && <p className="mt-2 text-sm font-bold text-[#0089A3]">{file.name}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006F85] transition-all disabled:bg-slate-300 shadow-xl shadow-cyan-100">
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Save Manifest Entry"}
                    </button>
                </form>
            </div>
            <p className="text-center mt-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
        </div>
    );
};

export default EntryForm;
