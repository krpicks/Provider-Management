import React from 'react';
import { X, Building2, ShieldCheck, Award, CreditCard, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { ProviderRecord } from '../../types/provider';

interface ProviderDetailModalProps {
  provider: ProviderRecord | null;
  onClose: () => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  onClose,
}) => {
  if (!provider) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-detail-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono text-slate-700 font-semibold">{provider.id}</span>
              <span aria-hidden="true">·</span>
              <span>{provider.providerType}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">{provider.status}</span>
            </div>
            <h2 id="provider-detail-title" className="text-lg font-bold text-slate-900">
              {provider.legalName}
            </h2>
            {provider.dba && (
              <p className="text-xs text-slate-500">DBA: {provider.dba}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-medium">NPI Number</span>
              <span className="font-mono text-slate-900 font-bold text-sm">{provider.npi}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Medicaid ID</span>
              <span className="font-mono text-slate-900 font-semibold">{provider.medicaidId}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Tax ID (TIN/EIN)</span>
              <span className="font-mono text-slate-900">{provider.taxIdMasked}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Taxonomy</span>
              <span className="font-mono text-slate-900">{provider.taxonomyCode}</span>
            </div>
          </div>

          {/* Demographics & Contact */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Practice Location & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{provider.city}, {provider.state} {provider.zip}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white truncate">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{provider.email}</span>
              </div>
            </div>
          </div>

          {/* Primary Source Certifications */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Active Certifications & Licenses ({provider.certifications.length})</span>
              <span className="text-[11px] text-emerald-700 font-normal">Primary Source Verified</span>
            </h3>

            {provider.certifications.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                No active credentials currently mapped to this master record.
              </p>
            ) : (
              <div className="space-y-2">
                {provider.certifications.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                        <span>{c.type}</span>
                        {c.state && <span className="text-slate-500 font-normal">({c.state})</span>}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        <span className="font-mono text-slate-700">{c.identifier}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{c.issuingBody}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-700 font-medium block">
                        Verified ({c.verificationSource})
                      </span>
                      <span className="text-slate-500 font-mono tabular-nums">
                        Expires {c.expirationDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EFT Banking & Enrollment Status */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" aria-hidden="true" />
              <div>
                <span className="font-semibold text-slate-900 block">Electronic Funds Transfer (EFT) Direct Deposit</span>
                <span className="text-slate-500">Status: {provider.eftVerificationStatus}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 font-medium">
              Effective {provider.effectiveDate}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Audit Last Modified: {provider.lastAuditTimestamp}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
