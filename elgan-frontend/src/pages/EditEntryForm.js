import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Edit3 } from 'lucide-react';

const EditEntryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        vesselName: '', 
        imoNumber: '', 
        mciNumber: '', 
        agentName: '',
        terminal: '', 
        wasteType: 'sludge', 
        volume: '',
        dateOfArrival: '', 
        dateOfInspection: ''
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                let token = localStorage.getItem('elgan_token');
                if (token) token = token.replace(/['"]+/g, '').trim();

                const res = await axios.get(`${API_BASE_URL}/api/entries/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // Find the specific entry from the list
                const entry = res.data.find(e => e._id === id);
                
                if (entry) {
                    setFormData({
                        vesselName: entry.vesselName || '',
                        imoNumber: entry.imoNumber || '',
                        mciNumber: entry.mciNumber || '',
                        agentName: entry.agentName || '',
                        terminal: entry.terminal || '',
                        wasteType: entry.wasteType || 'sludge',
                        volume: entry.volume || '',
                        dateOfArrival: entry.dateOfArrival || '',
                        dateOfInspection: entry.dateOfInspection || ''
                    });
                }
                setIsFetching(false);
            } catch (err) {
                console.error("Fetch Error", err);
                setIsFetching(false);
            }
        };
        fetchEntry();
    }, [id, API_BASE_URL]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let token = localStorage.getItem('elgan_token');
            if (token) token = token.replace(/['"]+/g, '').trim();

            // Note: Ensure your backend has a PUT route for /api/entries/:id
            await axios.put(`${API_BASE_URL}/api/entries/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Vessel Entry Updated Successfully");
            navigate('/fleet');
        } catch (err) {
            alert("Update Failed. Please check backend routes.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-[#0089A3]" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-[#0089A3] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <Edit3 size={20} />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Modify Asset Entry</h2>
                    </div>
                    <button onClick={() => navigate('/fleet')} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-all">
                        <ArrowLeft size={16} className="inline mr-1" /> Back
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</label>
                            <input name="vesselName" value={formData.vesselName} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" placeholder="Vessel Name" required />
                            <input name="imoNumber" value={formData.imoNumber} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" placeholder="IMO Number" required />
                            <input name="agentName" value={formData.agentName} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" placeholder="Agent Name" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics & Waste</label>
                            <input name="terminal" value={formData.terminal} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" placeholder="Terminal" />
                            <input name="volume" type="number" value={formData.volume} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]" placeholder="Volume m³" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" name="dateOfArrival" value={formData.dateOfArrival} onChange={handleChange} className="p-4 bg-slate-50 border rounded-2xl text-xs font-bold" />
                                <input type="date" name="dateOfInspection" value={formData.dateOfInspection} onChange={handleChange} className="p-4 bg-slate-50 border rounded-2xl text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Update Manifest Data
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEntryForm;
