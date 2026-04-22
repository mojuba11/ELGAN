import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSign, Calendar, FileText, ArrowLeft, Loader2, Save } from 'lucide-react';

const EditFinancialForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        reportMonth: '',
        totalIncome: '',
        assessorFee: '',
        remarks: ''
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // --- 1. FETCH EXISTING DATA ---
    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                let token = localStorage.getItem('elgan_token');
                if (token) token = token.replace(/['"]+/g, '').trim();

                const res = await axios.get(`${API_BASE_URL}/api/financials/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setFormData({
                    reportMonth: res.data.reportMonth || '',
                    totalIncome: res.data.totalIncome || '',
                    assessorFee: res.data.assessorFee || '',
                    remarks: res.data.remarks || ''
                });
                setIsFetching(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                alert("Failed to load financial record.");
                navigate('/fleet');
            }
        };
        fetchFinancialData();
    }, [id, API_BASE_URL, navigate]);

    // --- 2. HANDLE INPUT CHANGES ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'totalIncome') {
            const fee = (parseFloat(value) * 0.02).toFixed(2);
            setFormData({ ...formData, [name]: value, assessorFee: fee });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // --- 3. SUBMIT UPDATES ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let token = localStorage.getItem('elgan_token');
            if (token) token = token.replace(/['"]+/g, '').trim();

            await axios.put(`${API_BASE_URL}/api/financials/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("Financial Audit Updated Successfully.");
            navigate('/fleet');
        } catch (err) {
            console.error("Update Error:", err);
            alert(err.response?.data?.msg || "Update failed. Please try again.");
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
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#0089A3] rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Edit Financial Audit</h2>
                    </div>
                    <button 
                        onClick={() => navigate('/fleet')} 
                        className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft size={16} className="inline mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                            <Calendar size={14} className="mr-2 text-[#0089A3]" /> Reporting Period
                        </label>
                        <input 
                            type="month" 
                            name="reportMonth" 
                            value={formData.reportMonth}
                            onChange={handleChange}
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Total Monthly Income ($)</label>
                            <input 
                                type="number" 
                                name="totalIncome"
                                value={formData.totalIncome}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none"
                            />
                        </div>

                        <div className="bg-cyan-50 p-6 rounded-3xl border border-cyan-100">
                            <label className="text-[10px] font-black text-[#0089A3] uppercase block mb-2">2% Assessor Fee (Auto)</label>
                            <div className="text-2xl font-black text-[#0089A3]">
                                ${formData.assessorFee || '0.00'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-3">
                            <FileText size={14} className="mr-2 text-[#0089A3]" /> Audit Remarks
                        </label>
                        <textarea 
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Enter notes here..."
                            rows="4"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#0089A3]"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#006F85] transition-all shadow-xl flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        Save Audit Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFinancialForm;
