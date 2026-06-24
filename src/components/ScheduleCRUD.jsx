import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function ScheduleCRUD() {
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ time: '', foodType: '', portion: '', notes: '' });

  useEffect(() => {
    const saved = localStorage.getItem('kittyKateSchedules');
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse schedules");
      }
    }
  }, []);

  const saveToStorage = (data) => {
    setSchedules(data);
    localStorage.setItem('kittyKateSchedules', JSON.stringify(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.time || !formData.foodType) return;
    
    const newSchedule = {
      id: Date.now().toString(),
      ...formData
    };
    saveToStorage([...schedules, newSchedule]);
    setFormData({ time: '', foodType: '', portion: '', notes: '' });
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setFormData({ time: schedule.time, foodType: schedule.foodType, portion: schedule.portion, notes: schedule.notes });
  };

  const handleUpdate = () => {
    if (!formData.time || !formData.foodType) return;
    
    const updated = schedules.map((s) => 
      s.id === editingId ? { ...s, ...formData } : s
    );
    saveToStorage(updated);
    setEditingId(null);
    setFormData({ time: '', foodType: '', portion: '', notes: '' });
  };

  const handleDelete = (id) => {
    const filtered = schedules.filter(s => s.id !== id);
    saveToStorage(filtered);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ time: '', foodType: '', portion: '', notes: '' });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        Feeding Schedule
      </h2>

      {/* Form */}
      <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleAdd} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
            <input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Food Type</label>
            <input type="text" name="foodType" value={formData.foodType} onChange={handleInputChange} placeholder="e.g. Dry Kibble, Wet Salmon" required className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portion</label>
            <input type="text" name="portion" value={formData.portion} onChange={handleInputChange} placeholder="e.g. 1/2 cup" className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Mix with warm water" className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {editingId ? (
            <>
              <button type="button" onClick={handleCancel} className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <X size={16} /> Cancel
              </button>
              <button type="submit" className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
                <Save size={16} /> Update
              </button>
            </>
          ) : (
            <button type="submit" className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
              <Plus size={16} /> Add Schedule
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-slate-500 italic border-2 border-dashed border-slate-200 rounded-xl">
            No feeding schedules yet. Add one above!
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors shadow-sm gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{schedule.time}</span>
                  <span className="font-semibold text-slate-800">{schedule.foodType}</span>
                </div>
                <div className="text-sm text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                  {schedule.portion && <span><span className="font-medium">Portion:</span> {schedule.portion}</span>}
                  {schedule.notes && <span><span className="font-medium">Notes:</span> {schedule.notes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button onClick={() => handleEdit(schedule)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(schedule.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
