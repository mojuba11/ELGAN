import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, ArrowLeft, DollarSign, Calculator } from 'lucide-react';

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
            // Adjust the endpoint to match your backend financial route
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
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                
                {/* --- HEADER --- */}
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-3">
                        <FileSpreadsheet size={24} className="text-blue-400" />
                        <h2 className="text-xl font-black uppercase tracking-tighter">Monthly Financial Report</h2>
                    </div>
                    <button 
                        onClick={() => navigate('/fleet')} 
                        className="text-slate-400 hover:text-white flex items-center text-xs font-bold transition-colors uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    {/* Month Picker */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reporting Period (Month/Year)</label>
                        <input 
                            type="month" 
                            name="reportMonth"
                            value={formData.reportMonth}
                            onChange={handleChange}
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                        />
                    </div>

                    {/* Revenue Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Total Monthly Income (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-4 text-slate-400" size={20} />
                            <input 
                                type="number" 
                                name="totalIncome"
                                placeholder="0.00"
                                value={formData.totalIncome}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Calculated Fee Display */}
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Automatic 2% Assessor Fee</p>
                            <h3 className="text-2xl font-black text-emerald-700 tracking-tighter">
                                ${formData.assessorFee.toLocaleString()}
                            </h3>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-sm text-emerald-500">
                            <Calculator size={24} />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Additional Remarks</label>
                        <textarea 
                            name="remarks"
                            rows="3"
                            placeholder="e.g. Total logs reconciled with field office..."
                            onChange={handleChange}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:bg-slate-300 active:scale-95"
                    >
                        {isLoading ? "Processing..." : "Submit Monthly Report"}
                    </button>

                </form>
            </div>
            
            <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                © 2026 Elgan Integrated Ltd.
            </p>
        </div>
    );
};

export default FinancialReportForm;
