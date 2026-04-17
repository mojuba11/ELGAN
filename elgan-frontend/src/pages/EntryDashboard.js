import React, { useState } from 'react';
import { Upload, Ship, HardDrive, UserCheck } from 'lucide-react';

const EntryDashboard = () => {
  const [formData, setFormData] = useState({
    vesselName: '', imoNumber: '', wasteType: '', volume: '',
    entryDate: '', departureDate: '', charterer: '', owner: '',
    marpolOfficer: '', supervisor: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Captured for ELGAN:", formData);
    alert("Record Saved to Local State!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">ELGAN: Offshore Waste Entry</h1>
          <p className="text-slate-500">Manual Digitization of Inspection Reports</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Vessel Info Group */}
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg flex items-center">
            <Ship className="mr-2 text-blue-600" />
            <h2 className="font-semibold text-slate-700">Vessel Identity</h2>
          </div>
          
          <input className="border p-2 rounded" placeholder="Vessel Name" onChange={e => setFormData({...formData, vesselName: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="IMO Number" onChange={e => setFormData({...formData, imoNumber: e.target.value})} required />
          <input className="border p-2 rounded" placeholder="Vessel Owner" onChange={e => setFormData({...formData, owner: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Charterer Name" onChange={e => setFormData({...formData, charterer: e.target.value})} />

          {/* Waste & Operations Group */}
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg flex items-center">
            <HardDrive className="mr-2 text-green-600" />
            <h2 className="font-semibold text-slate-700">Waste & Operations</h2>
          </div>

          <select className="border p-2 rounded" onChange={e => setFormData({...formData, wasteType: e.target.value})}>
            <option>Select Waste Type</option>
            <option value="sludge">Oily Sludge</option>
            <option value="plastic">Plastic</option>
            <option value="food">Food Waste</option>
          </select>
          <input className="border p-2 rounded" type="number" placeholder="Volume (m³)" onChange={e => setFormData({...formData, volume: e.target.value})} />
          
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Date of Entry</label>
            <input className="border p-2 rounded" type="date" onChange={e => setFormData({...formData, entryDate: e.target.value})} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Date of Departure</label>
            <input className="border p-2 rounded" type="date" onChange={e => setFormData({...formData, departureDate: e.target.value})} />
          </div>

          {/* Personnel Group */}
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg flex items-center">
            <UserCheck className="mr-2 text-purple-600" />
            <h2 className="font-semibold text-slate-700">Reporting Personnel</h2>
          </div>
          <input className="border p-2 rounded" placeholder="MARPOL Officer Name" onChange={e => setFormData({...formData, marpolOfficer: e.target.value})} />
          <input className="border p-2 rounded" placeholder="Offshore Supervisor" onChange={e => setFormData({...formData, supervisor: e.target.value})} />

          {/* File Upload */}
          <div className="col-span-2 border-2 border-dashed border-gray-300 p-6 text-center rounded-lg hover:bg-gray-50">
            <Upload className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Drag and drop the scanned paper report here (PDF/JPG)</p>
            <input type="file" className="hidden" id="fileUpload" />
            <label htmlFor="fileUpload" className="cursor-pointer text-blue-600 font-medium">Browse Files</label>
          </div>

          <button type="submit" className="col-span-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            SUBMIT TO REGISTRY
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryDashboard;