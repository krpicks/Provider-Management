import React from 'react';
import { Building2, Stethoscope, HeartPulse, Brain, Activity, UserCheck } from 'lucide-react';

export const NetworkDistribution: React.FC = () => {
  const specialties = [
    { name: 'Family & Internal Medicine', count: 942, percent: 33.1, color: 'bg-blue-600' },
    { name: 'Pediatrics & Adolescent', count: 486, percent: 17.1, color: 'bg-emerald-600' },
    { name: 'Cardiovascular Disease', count: 320, percent: 11.2, color: 'bg-indigo-600' },
    { name: 'Behavioral Health & Psychiatry', count: 412, percent: 14.5, color: 'bg-purple-600' },
    { name: 'Orthopedics & Surgical', count: 298, percent: 10.5, color: 'bg-amber-600' },
    { name: 'Acute Facilities & Diagnostics', count: 389, percent: 13.6, color: 'bg-slate-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" aria-hidden="true" />
            Network Specialty & Facility Composition
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active enrolled healthcare providers categorized by primary taxonomy
          </p>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 mb-4">
        {specialties.map((item) => (
          <div
            key={item.name}
            style={{ width: `${item.percent}%` }}
            className={`${item.color} h-full transition-all duration-300`}
            title={`${item.name}: ${item.count} (${item.percent}%)`}
          />
        ))}
      </div>

      {/* List breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {specialties.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/75 border border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-xs ${item.color}`} aria-hidden="true" />
              <span className="text-slate-700 font-medium">{item.name}</span>
            </div>
            <div className="text-slate-900 font-mono tabular-nums font-semibold">
              {item.count.toLocaleString()} <span className="text-slate-400 font-normal">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
