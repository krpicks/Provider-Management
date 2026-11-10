import React, { useState } from 'react';
import { Award, AlertTriangle, Send, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { UPCOMING_EXPIRING_CERTIFICATIONS } from '../../data/mockData';

export const CertificationExpirations: React.FC = () => {
  const [items, setItems] = useState(UPCOMING_EXPIRING_CERTIFICATIONS);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const handleSendNotice = (id: string, providerName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, automatedNoticeSent: true } : item
      )
    );
    setNotificationStatus(`60-day re-credentialing renewal packet dispatched to ${providerName}`);
    setTimeout(() => {
      setNotificationStatus(null);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Imminent Credential & License Expirations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary source credentials expiring in next 30–60 days requiring renewal packets
          </p>
        </div>
      </div>

      {notificationStatus && (
        <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{notificationStatus}</span>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{item.providerName}</span>
                <span className="text-[11px] font-mono text-slate-500">NPI: {item.npi}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="font-medium text-slate-700">{item.certificationType}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-600">{item.identifier}</span>
                <span aria-hidden="true">·</span>
                <span className={`font-mono tabular-nums ${item.daysLeft <= 30 ? 'text-rose-600 font-semibold' : 'text-amber-600'}`}>
                  Expires in {item.daysLeft} days ({item.expirationDate})
                </span>
              </div>
            </div>

            <div>
              {item.automatedNoticeSent ? (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Notice Sent
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendNotice(item.id, item.providerName)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>Send Notice</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
