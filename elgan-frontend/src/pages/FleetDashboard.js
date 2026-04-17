import React from 'react';
import { Plus, Download, Edit, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FleetDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Fleet Operations Log</h1>
          <p className="text-gray-600">Manage and track digitized waste manifests</p>
        </div>
        <button 
          onClick={() => navigate('/entry')}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" /> File Entry Again
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4">Vessel Name</th>
              <th className="p-4">Date Entered</th>
              <th className="p-4">Waste Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Sample Row */}
            <tr>
              <td className="p-4 font-medium">MT ELGAN EXPLORER</td>
              <td className="p-4">2026-04-17</td>
              <td className="p-4">Oily Sludge</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Verified</span></td>
              <td className="p-4 text-right space-x-3">
                <button className="text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                <button className="text-gray-600 hover:text-gray-800"><Download size={18}/></button>
                <button className="text-green-600 hover:text-green-800"><Send size={18}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetDashboard;