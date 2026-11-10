import React, { useState } from 'react';
import { X, CheckCircle2, Building2, User, AlertCircle } from 'lucide-react';
import { ProviderType, ReviewQueueItem } from '../../types/provider';

interface NewEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newItem: ReviewQueueItem) => void;
}

export const NewEnrollmentModal: React.FC<NewEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [legalName, setLegalName] = useState('');
  const [npi, setNpi] = useState('');
  const [providerType, setProviderType] = useState<ProviderType>('Individual Practitioner');
  const [primarySpecialty, setPrimarySpecialty] = useState('Family Medicine');
  const [taxonomyCode, setTaxonomyCode] = useState('207Q00000X');
  const [city, setCity] = useState('');
  const [state, setState] = useState('OH');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!legalName.trim()) {
      setErrorMsg('Please enter the provider legal name.');
      return;
    }

    if (!npi.trim() || npi.length !== 10 || !/^\d+$/.test(npi)) {
      setErrorMsg('Please enter a valid 10-digit National Provider Identifier (NPI).');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const newItem: ReviewQueueItem = {
      id: `REV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      providerId: `PRV-${Math.floor(1000 + Math.random() * 9000)}`,
      providerName: legalName,
      npi: npi,
      providerType: providerType,
      primarySpecialty: primarySpecialty,
      transactionType: 'Initial Enrollment',
      submissionDate: todayStr,
      slaTargetDate: targetDateStr,
      daysInQueue: 0,
      slaStatus: 'normal',
      assignedReviewer: 'Sarah Jenkins',
      priority: 'Medium',
      status: 'Pending Review',
      summaryNotes: summaryNotes || 'New initial enrollment application submitted via Provider Plus portal. Initial intake validation complete.',
      checksCompleted: {
        oigSamExclusion: true,
        licenseVerification: false,
        malpracticeHistory: false,
        eftPreNoteCheck: false,
        boardCertification: false,
      },
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-enrollment-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="modal-enrollment-title" className="text-base font-bold text-slate-900">
                Initiate Provider Enrollment
              </h2>
              <p className="text-xs text-slate-500">
                Submit an initial provider application into the CMS-PM credentialing review queue
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="legalName" className="block text-xs font-semibold text-slate-800 mb-1">
                Legal Entity Name / Practitioner Name *
              </label>
              <input
                id="legalName"
                type="text"
                required
                value={legalName}
                onChange={(e) => {
                  setLegalName(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. Dr. Catherine Brooks, MD or Great Lakes Cardiology"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="npi" className="block text-xs font-semibold text-slate-800 mb-1">
                10-Digit NPI Number *
              </label>
              <input
                id="npi"
                type="text"
                maxLength={10}
                required
                value={npi}
                onChange={(e) => {
                  setNpi(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                placeholder="10-digit number"
                className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="providerType" className="block text-xs font-semibold text-slate-800 mb-1">
                Provider Classification *
              </label>
              <select
                id="providerType"
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as ProviderType)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Individual Practitioner">Individual Practitioner</option>
                <option value="Group Practice">Group Practice</option>
                <option value="Hospital / Inpatient Facility">Hospital / Inpatient Facility</option>
                <option value="Diagnostic & Imaging">Diagnostic & Imaging</option>
                <option value="Allied Health Professional">Allied Health Professional</option>
              </select>
            </div>

            <div>
              <label htmlFor="specialty" className="block text-xs font-semibold text-slate-800 mb-1">
                Primary Specialty *
              </label>
              <input
                id="specialty"
                type="text"
                required
                value={primarySpecialty}
                onChange={(e) => setPrimarySpecialty(e.target.value)}
                placeholder="e.g. Family Medicine, Pediatrics"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="taxonomy" className="block text-xs font-semibold text-slate-800 mb-1">
                Primary Taxonomy Code
              </label>
              <input
                id="taxonomy"
                type="text"
                value={taxonomyCode}
                onChange={(e) => setTaxonomyCode(e.target.value)}
                placeholder="e.g. 207Q00000X"
                className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-slate-800 mb-1">
                Practice City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="zip" className="block text-xs font-semibold text-slate-800 mb-1">
                ZIP Code
              </label>
              <input
                id="zip"
                type="text"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 43215"
                className="w-full font-mono text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="summaryNotes" className="block text-xs font-semibold text-slate-800 mb-1">
                Application Intake Notes
              </label>
              <textarea
                id="summaryNotes"
                rows={2}
                value={summaryNotes}
                onChange={(e) => setSummaryNotes(e.target.value)}
                placeholder="Notes on hospital affiliations, initial documentation verification status, or urgent enrollment reasons..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              Submit Application to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
