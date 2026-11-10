import React, { useState } from 'react';
import { Search, X, Building2, User, CheckCircle2, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { SAMPLE_PROVIDERS } from '../../data/mockData';
import { ProviderRecord } from '../../types/provider';

interface QuickProviderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: ProviderRecord) => void;
}

export const QuickProviderSearchModal: React.FC<QuickProviderSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProvider,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderRecord | null>(null);

  if (!isOpen) return null;

  const results = SAMPLE_PROVIDERS.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      p.legalName.toLowerCase().includes(q) ||
      (p.dba && p.dba.toLowerCase().includes(q)) ||
      p.npi.includes(q) ||
      p.primarySpecialty.toLowerCase().includes(q) ||
      p.medicaidId.toLowerCase().includes(q)
    );
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-search-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            id="quick-search-input"
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider by NPI (10-digit), Legal Name, DBA, or Medicaid ID..."
            className="w-full text-sm bg-transparent border-none focus:outline-none placeholder-slate-400 text-slate-900"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No registered providers found matching "{searchTerm}"
            </div>
          ) : (
            results.map((provider) => (
              <div
                key={provider.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedProvider(provider);
                  onSelectProvider(provider);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedProvider(provider);
                    onSelectProvider(provider);
                  }
                }}
                className="py-3 px-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{provider.legalName}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      provider.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {provider.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-mono text-slate-700 font-medium">NPI: {provider.npi}</span>
                    <span aria-hidden="true">·</span>
                    <span>{provider.primarySpecialty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{provider.city}, {provider.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-slate-400 hidden sm:block">
                    <span className="block font-mono">{provider.medicaidId}</span>
                    <span>{provider.certificationsCount} Active Certs</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {results.length} active master records</span>
          <span className="text-slate-400">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
