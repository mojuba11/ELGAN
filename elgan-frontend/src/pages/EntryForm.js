import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Ship, Anchor, FilePlus, ArrowLeft, Loader2 } from 'lucide-react'; 

const EntryForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        vesselName: '', 
        vesselType: '', 
        imoNumber: '', 
        mciNumber: '', // Initialized in state
        terminal: '', 
        chartererName: '',
        agentName: '', 
        wasteType: 'sludge', 
        volume: '', 
        dateOfArrival: '', 
        dateOfInspection: '',
        nimasaInspector: false, 
        xpoInspector: false
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // --- SESSION VALIDATION ---
    useEffect(() => {
        const token = localStorage.getItem('elgan_token');
        if (!token) {
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
        
        let token = localStorage.getItem('elgan_token');
        if (token) {
            token = token.replace(/['"]+/g, '').trim(); 
        }

        if (!token || token === 'null' || token === 'undefined') {
            alert("Your session has expired. Please log in again.");
            localStorage.clear();
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
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
            
            alert("Entry Authorized & Recorded Successfully.");
            navigate('/fleet');
        } catch (err) {
            console.error("Submission Error Status:", err.response?.status);
            
            if (err.response?.status === 401) {
                alert("Authentication failed. Please log in again.");
                localStorage.clear();
                window.location.href = '/login';
            } else {
                alert(err.response?.data?.msg || "Submission Error. Please check all fields.");
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
                        <img src="/elgan.jpeg" alt="ELGAN" className="h-10 w-auto bg-white rounded-lg p-1" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">New Asset Entry</h2>
                    </div>
                    <button 
                        onClick={() => navigate('/fleet')} 
                        className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all text-white"
                    >
                        <ArrowLeft size={16} className="inline mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LEFT COLUMN: VESSEL, IMO, MCI & AGENT INFO */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Ship size={14} className="mr-2 text-[#0089A3]" /> Vessel & Agent Identification
                            </label>
                            <input name="vesselName" placeholder="Vessel Name" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700" />
                            <input name="imoNumber" placeholder="IMO Number" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700" />
                            <input name="mciNumber" placeholder="MCI Number" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700" />
                            <input name="agentName" placeholder="Agent Name" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700" />
                        </div>

                        {/* RIGHT COLUMN: TERMINAL & DATES */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Anchor size={14} className="mr-2 text-[#0089A3]" /> Deployment Details
                            </label>
                            <input name="terminal" placeholder="Terminal/Berth" onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 mb-1 ml-1 uppercase">Arrival Date</p>
                                    <input type="date" name="dateOfArrival" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 mb-1 ml-1 uppercase">Inspect Date</p>
                                    <input type="date" name="dateOfInspection" onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* METRICS PANEL */}
                    <div className="bg-cyan-50/50 p-6 rounded-3xl border border-cyan-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Waste Category</label>
                            <select name="wasteType" onChange={handleChange} value={formData.wasteType} className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#0089A3] text-slate-700">
                                <option value="sludge">Oily Sludge</option>
                                <option value="plastic">Plastic</option>
                                <option value="garbage">Garbage</option>
                                <option value="hazardous">Hazardous</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2 ml-1">Quantity (m³)</label>
                            <input name="volume" type="number" step="0.01" placeholder="0.00" onChange={handleChange} required className="w-full p-4 bg-white border border-cyan-200 rounded-2xl font-black text-xl text-[#0089A3] outline-none focus:ring-2 focus:ring-[#0089A3]" />
                        </div>
                    </div>

                    {/* FILE UPLOAD PANEL */}
                    <div className="group relative border-2 border-dashed border-slate-200 p-8 rounded-3xl text-center hover:border-[#0089A3] transition-all bg-slate-50">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <FilePlus className="text-slate-300 mx-auto mb-2" size={40} />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Digital Manifest (PDF/Image)</p>
                        {file && <p className="mt-2 text-sm font-black text-[#0089A3] bg-cyan-50 px-4 py-1 rounded-full border border-cyan-100 inline-block">{file.name}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006F85] transition-all disabled:bg-slate-300 shadow-xl shadow-cyan-100 text-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin mx-auto text-white" /> : "Authorize and Sync Entry"}
                    </button>
                </form>
            </div>
            <p className="text-center mt-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Elgan integrated Ltd.</p>
        </div>
    );
};

export default EntryForm;
