import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Send,
  AlertCircle
} from 'lucide-react';
import { ReviewQueueItem } from '../../types/provider';

interface ReviewItemDrawerProps {
  item: ReviewQueueItem | null;
  onClose: () => void;
  onApprove: (itemId: string, notes: string) => void;
  onRequestInfo: (itemId: string, reason: string) => void;
  onReject: (itemId: string, reason: string) => void;
}

export const ReviewItemDrawer: React.FC<ReviewItemDrawerProps> = ({
  item,
  onClose,
  onApprove,
  onRequestInfo,
  onReject,
}) => {
  const [operatorNotes, setOperatorNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!item) return null;

  const handleApprove = () => {
    onApprove(item.id, operatorNotes || 'Approved following complete primary source verification.');
    setActionSuccessMessage('Application approved successfully. Audit trail record logged.');
    setTimeout(() => {
      setActionSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleRequestInfo = () => {
    if (!operatorNotes) {
      alert('Please enter a note describing the missing information or documentation required.');
      return;
    }
    onRequestInfo(item.id, operatorNotes);
    setActionSuccessMessage('Information request transmitted to provider portal.');
    setTimeout(() => {
      setActionSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    if (!operatorNotes) {
      alert('Please specify the formal regulatory or compliance basis for rejection.');
      return;
    }
    onReject(item.id, operatorNotes);
    setActionSuccessMessage('Formal notice of rejection generated.');
    setTimeout(() => {
      setActionSuccessMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono text-slate-700 font-semibold">{item.id}</span>
              <span aria-hidden="true">·</span>
              <span>{item.transactionType}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Received {item.submissionDate}</span>
            </div>
            <h2 id="drawer-title" className="text-lg font-bold text-slate-900">
              {item.providerName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close review details"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {actionSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Provider Overview Strip */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-medium">National Provider Identifier (NPI)</span>
                <span className="font-mono font-semibold text-slate-900">{item.npi}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block uppercase font-medium">Provider Type</span>
                <span className="text-slate-900 font-medium">{item.providerType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block uppercase font-medium">Primary Specialty</span>
                <span className="text-slate-900">{item.primarySpecialty}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block uppercase font-medium">Assigned Credentialing Officer</span>
                <span className="text-slate-900">{item.assignedReviewer}</span>
              </div>
            </div>
          </div>

          {/* SLA & Priority Horizon */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-500 font-medium">14-Day CMS Statutory SLA Target</div>
                <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                  {item.slaTargetDate} ({item.daysInQueue} days currently in queue)
                </div>
              </div>
            </div>
            <div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                item.slaStatus === 'breached' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : item.slaStatus === 'approaching'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {item.slaStatus === 'breached' ? 'SLA Breached' : item.slaStatus === 'approaching' ? 'Approaching Deadline' : 'On-Track (Within SLA)'}
              </span>
            </div>
          </div>

          {/* Primary Source Verification Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
              Mandatory PSV Verification Checklist
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm text-slate-800">OIG / SAM Exclusion List Database Screening</span>
                </div>
                <span className="text-xs text-emerald-700 font-medium">Cleared · No Matches</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  {item.checksCompleted.licenseVerification ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  )}
                  <span className="text-sm text-slate-800">State Medical Board License Primary Source Verification</span>
                </div>
                <span className={`text-xs font-medium ${item.checksCompleted.licenseVerification ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {item.checksCompleted.licenseVerification ? 'Verified Active' : 'Pending Verification'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm text-slate-800">NPDB Malpractice & Disciplinary History</span>
                </div>
                <span className="text-xs text-emerald-700 font-medium">Report Received · Clear</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5">
                  {item.checksCompleted.eftPreNoteCheck ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  )}
                  <span className="text-sm text-slate-800">Automated Clearing House (ACH) EFT Pre-Note</span>
                </div>
                <span className={`text-xs font-medium ${item.checksCompleted.eftPreNoteCheck ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {item.checksCompleted.eftPreNoteCheck ? 'Pre-Note Verified' : 'Awaiting Zero-Dollar ACK'}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Notes & Context */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Application Notes & Documentation
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed">
              {item.summaryNotes}
            </p>
          </div>

          {/* Operator Determination Notes Input */}
          <div>
            <label htmlFor="operator-notes" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Reviewer Determination Notes (Required for Actions)
            </label>
            <textarea
              id="operator-notes"
              rows={3}
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Record credentialing committee findings, primary source verification verification IDs, or specific documentation requests..."
              className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel / Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestInfo}
              className="px-3.5 py-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              Request Info
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              Approve Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
