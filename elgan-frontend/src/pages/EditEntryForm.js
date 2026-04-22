import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Ship, Anchor, Save, ArrowLeft, Loader2 } from 'lucide-react';

const EditEntryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        vesselName: '', imoNumber: '', mciNumber: '', agentName: '',
        terminal: '', wasteType: 'sludge', volume: '',
        dateOfArrival: '', dateOfInspection: ''
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const token = localStorage.getItem('elgan_token').replace(/['"]+/g, '').trim();
                const res = await axios.get(`${API_BASE_URL}/api/entries/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFormData(res.data);
            } catch (err) {
                console.error("Fetch Error", err);
                alert("Could not load entry data.");
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
            const token = localStorage.getItem('elgan_token').replace(/['"]+/g, '').trim();
            await axios.put(`${API_BASE_URL}/api/entries/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Entry Updated Successfully");
            navigate('/fleet');
        } catch (err) {
            alert("Update Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-slate-800 p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-black uppercase">Edit Asset Entry</h2>
                    <button onClick={() => navigate('/fleet')} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase"><ArrowLeft size={16} className="inline mr-1" /> Back</button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vessel Identification</label>
                            <input name="vesselName" value={formData.vesselName} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Vessel Name" />
                            <input name="imoNumber" value={formData.imoNumber} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="IMO Number" />
                            <input name="agentName" value={formData.agentName} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Agent Name" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics</label>
                            <input name="terminal" value={formData.terminal} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Terminal" />
                            <input name="volume" value={formData.volume} onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Volume m³" />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006F85]">
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Update Vessel Entry"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEntryForm;
