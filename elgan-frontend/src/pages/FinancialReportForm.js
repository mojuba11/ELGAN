import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calculator, Loader2 } from 'lucide-react';

const FinancialReportForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        reportMonth: new Date().toISOString().slice(0, 7), // Defaults to current month YYYY-MM
        totalIncome: '',
        assessorFee: 0,
        remarks: ''
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Auto-calculate 2% fee whenever totalIncome changes
    useEffect(() => {
        const income = parseFloat(formData.totalIncome) || 0;
        setFormData(prev => ({
            ...prev,
            assessorFee: (income * 0.02).toFixed(2)
        }));
    }, [formData.totalIncome]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('elgan_token');

        if (!token) {
            alert("Session expired. Please log in.");
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/financials/add`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Financial Report Submitted Successfully!");
            navigate('/fleet');
        } catch (err) {
            console.error("Finance Submission Error:", err);
            alert(err.response?.data?.msg || "Failed to submit financial report.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* --- BRANDED HEADER --- */}
                <div className="bg-[#0089A3] p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <img src="/elgan.jpeg" alt="Logo" className="h-10 w-auto bg-white rounded-lg p-1" />
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter leading-none text-white">Monthly Report</h2>
                            <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest mt-1">Financial Audit Entry</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/fleet')} 
                        className="text-white/80 hover:text-white flex items-center text-xs font-bold transition-colors uppercase tracking-widest bg-white/10 px-3 py-2 rounded-lg"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    
                    {/* Month Picker */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reporting Period (Month/Year)</label>
                        <input 
                            type="month" 
                            name="reportMonth"
                            value={formData.reportMonth}
                            onChange={handleChange}
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-bold text-slate-700 transition-all"
                        />
                    </div>

                    {/* Revenue Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Total Monthly Income (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-4 text-[#0089A3]" size={20} />
                            <input 
                                type="number" 
                                name="totalIncome"
                                placeholder="0.00"
                                value={formData.totalIncome}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-black text-2xl text-slate-800 transition-all"
                            />
                        </div>
                    </div>

                    {/* Calculated Fee Display - Teal Branded Area */}
                    <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-3xl flex justify-between items-center shadow-inner">
                        <div>
                            <p className="text-[10px] font-black text-[#0089A3] uppercase tracking-widest">Automatic 2% Assessor Fee</p>
                            <h3 className="text-3xl font-black text-[#0089A3] tracking-tighter">
                                ${Number(formData.assessorFee).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </h3>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-sm text-[#0089A3]">
                            <Calculator size={28} />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Additional Remarks</label>
                        <textarea 
                            name="remarks"
                            rows="3"
                            placeholder="Notes for management reconciliation..."
                            onChange={handleChange}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0089A3] font-medium text-slate-600 transition-all"
                        ></textarea>
                    </div>

                    {/* Submit Button - Branded Teal */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#0089A3] text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#006F85] transition-all flex items-center justify-center shadow-lg shadow-cyan-100 disabled:bg-slate-300 active:scale-95 text-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                <span>Processing...</span>
                            </>
                        ) : "Authorize & Submit Report"}
                    </button>

                </form>
            </div>
            
            <p className="text-center mt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                © 2026 Elgan integrated Ltd.
            </p>
        </div>
    );
};

export default FinancialReportForm;
