import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Download,
  Building2,
  FileText
} from 'lucide-react';
import { ReviewQueueItem, ReviewTransactionType, SlaStatus } from '../../types/provider';

interface ReviewQueueTableProps {
  items: ReviewQueueItem[];
  onSelectReviewItem: (item: ReviewQueueItem) => void;
  selectedFilterType: string;
  onChangeFilterType: (type: string) => void;
}

export const ReviewQueueTable: React.FC<ReviewQueueTableProps> = ({
  items,
  onSelectReviewItem,
  selectedFilterType,
  onChangeFilterType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [slaFilter, setSlaFilter] = useState<'all' | SlaStatus>('all');

  const filterTabs = [
    { label: 'All Reviews', value: 'all' },
    { label: 'Initial Enrollment', value: 'Initial Enrollment' },
    { label: 'Re-credentialing', value: 'Re-credentialing' },
    { label: 'EFT Pre-Notes', value: 'EFT Pre-Note Verification' },
    { label: 'Address Changes', value: 'Address & Location Change' },
    { label: 'CHOW', value: 'Change of Ownership (CHOW)' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesType = selectedFilterType === 'all' || item.transactionType === selectedFilterType;
    const matchesSla = slaFilter === 'all' || item.slaStatus === slaFilter;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      item.providerName.toLowerCase().includes(query) ||
      item.npi.includes(query) ||
      item.primarySpecialty.toLowerCase().includes(query) ||
      item.assignedReviewer.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    return matchesType && matchesSla && matchesSearch;
  });

  const exportCsv = () => {
    const headers = ['Review ID', 'Provider Name', 'NPI', 'Type', 'Submitted', 'Target SLA', 'Days in Queue', 'Status', 'Reviewer'];
    const rows = filteredItems.map(item => [
      item.id,
      `"${item.providerName}"`,
      item.npi,
      `"${item.transactionType}"`,
      item.submissionDate,
      item.slaTargetDate,
      item.daysInQueue,
      item.status,
      `"${item.assignedReviewer}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `provider_plus_pending_reviews_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Pending Provider Reviews & Applications Queue
            </h2>
            <div className="flex items-center text-xs text-slate-500 gap-1.5 mt-0.5">
              <span>CMS 14-Day Statutory SLA Horizon</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{filteredItems.length} records matching criteria</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NPI, Provider, or Reviewer..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white"
                aria-label="Search review queue"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* SLA Filter Dropdown */}
            <select
              value={slaFilter}
              onChange={(e) => setSlaFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              aria-label="Filter by SLA status"
            >
              <option value="all">All SLA Statuses</option>
              <option value="normal">Normal (On Track)</option>
              <option value="approaching">Approaching (7+ days)</option>
              <option value="breached">SLA Breached (14+ days)</option>
            </select>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={exportCsv}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              title="Export filtered review queue to CSV"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Transaction Type Segmented Filter Controls */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => {
            const isActive = selectedFilterType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChangeFilterType(tab.value)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Body */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-900 mb-1">No pending review records match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria, switching transaction type tabs, or resetting the SLA filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSlaFilter('all');
              onChangeFilterType('all');
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th scope="col" className="py-3 px-4">Provider / Organization</th>
                <th scope="col" className="py-3 px-4">Identifier / NPI</th>
                <th scope="col" className="py-3 px-4">Transaction Type</th>
                <th scope="col" className="py-3 px-4">Submission Date</th>
                <th scope="col" className="py-3 px-4">SLA Deadline</th>
                <th scope="col" className="py-3 px-4">Reviewer</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{item.providerName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {item.primarySpecialty}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-800 font-medium tracking-tight">
                        {item.npi}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {item.id}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium">
                        {item.transactionType}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {item.submissionDate}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.slaStatus === 'breached' 
                            ? 'bg-rose-500' 
                            : item.slaStatus === 'approaching' 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                        }`} aria-hidden="true" />
                        <span className="font-mono tabular-nums text-slate-700">
                          {item.slaTargetDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {item.daysInQueue} days in queue
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {item.assignedReviewer}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700'
                          : item.status === 'Information Requested'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectReviewItem(item)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        aria-label={`Review application for ${item.providerName}`}
                      >
                        <span>Review & Process</span>
                        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
