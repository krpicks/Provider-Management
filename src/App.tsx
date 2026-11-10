import React, { useState, useEffect } from 'react';
import { CoreUxShell } from './components/layout/CoreUxShell';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { ReviewQueueTable } from './components/dashboard/ReviewQueueTable';
import { ReviewItemDrawer } from './components/dashboard/ReviewItemDrawer';
import { CertificationExpirations } from './components/dashboard/CertificationExpirations';
import { NetworkDistribution } from './components/dashboard/NetworkDistribution';
import { QuickProviderSearchModal } from './components/dashboard/QuickProviderSearchModal';
import { ProviderDetailModal } from './components/dashboard/ProviderDetailModal';
import { NewEnrollmentModal } from './components/modals/NewEnrollmentModal';
import { INITIAL_METRICS, INITIAL_REVIEW_QUEUE, SAMPLE_PROVIDERS } from './data/mockData';
import { ReviewQueueItem, ProviderRecord, DashboardMetrics } from './types/provider';
import { Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(INITIAL_REVIEW_QUEUE);
  const [activeFocus, setActiveFocus] = useState<'all' | 'providers' | 'certifications' | 'reviews'>('all');
  const [selectedFilterType, setSelectedFilterType] = useState<string>('all');
  
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentTenant, setCurrentTenant] = useState('OH-MED-01');

  // Modals & Drawers
  const [activeReviewItem, setActiveReviewItem] = useState<ReviewQueueItem | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isNewEnrollmentOpen, setIsNewEnrollmentOpen] = useState(false);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<ProviderRecord | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Review Item Approval
  const handleApproveReview = (itemId: string, notes: string) => {
    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'Approved', checksCompleted: { ...item.checksCompleted, licenseVerification: true, eftPreNoteCheck: true } }
          : item
      )
    );

    // Update metrics dynamically
    setMetrics((prev) => {
      const newPendingCount = Math.max(0, prev.pendingReviews.totalQueueCount - 1);
      const pendingDelta = Number(((newPendingCount - 145) / 145 * 100).toFixed(1));
      return {
        ...prev,
        totalProviders: {
          ...prev.totalProviders,
          activeCount: prev.totalProviders.activeCount + 1,
          pendingCount: Math.max(0, prev.totalProviders.pendingCount - 1),
        },
        pendingReviews: {
          ...prev.pendingReviews,
          totalQueueCount: newPendingCount,
          weekTrendPercent: pendingDelta,
        },
      };
    });

    showToast(`Application ${itemId} approved. Provider activated into network.`);
  };

  // Handle Request Additional Information
  const handleRequestInfo = (itemId: string, reason: string) => {
    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'Information Requested', summaryNotes: `INFO REQUEST: ${reason}` }
          : item
      )
    );
    showToast(`Additional documentation request dispatched for ${itemId}.`);
  };

  // Handle Rejection
  const handleRejectReview = (itemId: string, reason: string) => {
    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: 'Rejected', summaryNotes: `REJECTED: ${reason}` }
          : item
      )
    );

    setMetrics((prev) => {
      const newPendingCount = Math.max(0, prev.pendingReviews.totalQueueCount - 1);
      const pendingDelta = Number(((newPendingCount - 145) / 145 * 100).toFixed(1));
      return {
        ...prev,
        pendingReviews: {
          ...prev.pendingReviews,
          totalQueueCount: newPendingCount,
          weekTrendPercent: pendingDelta,
        },
      };
    });

    showToast(`Application ${itemId} marked as Rejected.`);
  };

  // Handle New Enrollment submission
  const handleAddNewEnrollment = (newItem: ReviewQueueItem) => {
    setReviewQueue((prev) => [newItem, ...prev]);

    // Update summary metrics
    setMetrics((prev) => {
      const newTotal = prev.totalProviders.count + 1;
      const totalDelta = Number(((newTotal - 2788) / 2788 * 100).toFixed(1));
      const newPending = prev.pendingReviews.totalQueueCount + 1;
      const pendingDelta = Number(((newPending - 145) / 145 * 100).toFixed(1));
      return {
        ...prev,
        totalProviders: {
          ...prev.totalProviders,
          count: newTotal,
          pendingCount: prev.totalProviders.pendingCount + 1,
          weekTrendPercent: totalDelta,
        },
        pendingReviews: {
          ...prev.pendingReviews,
          totalQueueCount: newPending,
          weekTrendPercent: pendingDelta,
        },
      };
    });

    showToast(`Enrollment initiated for ${newItem.providerName} (NPI: ${newItem.npi}).`);
  };

  return (
    <CoreUxShell
      activeNav={activeNav}
      onSelectNav={(nav) => {
        setActiveNav(nav);
        if (nav === 'search' || nav === 'master') {
          setIsQuickSearchOpen(true);
        }
      }}
      onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
      onOpenNewEnrollment={() => setIsNewEnrollmentOpen(true)}
      currentTenant={currentTenant}
      onChangeTenant={(tenant) => {
        setCurrentTenant(tenant);
        showToast(`Tenant context switched to ${tenant}`);
      }}
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Provider Management Executive Dashboard
          </h1>
          <div className="flex items-center text-xs text-slate-500 gap-1.5 mt-1">
            <span>Enterprise Medicaid & Commercial Network Operations</span>
            <span aria-hidden="true">·</span>
            <span>CMS-PM Target Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Tenant {currentTenant}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setMetrics({ ...INITIAL_METRICS });
              setReviewQueue([...INITIAL_REVIEW_QUEUE]);
              setActiveFocus('all');
              setSelectedFilterType('all');
              showToast('Operational dashboard metrics refreshed from read-model.');
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            title="Refresh operational dashboard data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Sync Data</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewEnrollmentOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            + New Enrollment
          </button>
        </div>
      </div>

      {/* Active Focus Filter Notification */}
      {activeFocus !== 'all' && (
        <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs flex items-center justify-between text-blue-900">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            <span>
              Focused View: Filtering dashboard for <strong>{activeFocus.toUpperCase()}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveFocus('all')}
            className="font-medium underline hover:text-blue-700"
          >
            Reset focus to all metrics
          </button>
        </div>
      )}

      {/* Primary KPI Summary Cards */}
      <SummaryCards
        metrics={metrics}
        activeFocus={activeFocus}
        onSelectFocus={setActiveFocus}
      />

      {/* Operational Sections */}
      <div className="space-y-6">
        {/* Main Review Queue Table */}
        <section aria-labelledby="review-queue-heading">
          <ReviewQueueTable
            items={reviewQueue}
            onSelectReviewItem={setActiveReviewItem}
            selectedFilterType={selectedFilterType}
            onChangeFilterType={setSelectedFilterType}
          />
        </section>

        {/* Secondary Operational Horizon: Expirations & Specialty Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CertificationExpirations />
          <NetworkDistribution />
        </div>
      </div>

      {/* Interactive Review Drawer */}
      <ReviewItemDrawer
        item={activeReviewItem}
        onClose={() => setActiveReviewItem(null)}
        onApprove={handleApproveReview}
        onRequestInfo={handleRequestInfo}
        onReject={handleRejectReview}
      />

      {/* Quick Search Modal */}
      <QuickProviderSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSelectProvider={(p) => {
          setIsQuickSearchOpen(false);
          setSelectedProviderDetail(p);
        }}
      />

      {/* Provider Detail Modal */}
      <ProviderDetailModal
        provider={selectedProviderDetail}
        onClose={() => setSelectedProviderDetail(null)}
      />

      {/* New Enrollment Modal */}
      <NewEnrollmentModal
        isOpen={isNewEnrollmentOpen}
        onClose={() => setIsNewEnrollmentOpen(false)}
        onSubmit={handleAddNewEnrollment}
      />
    </CoreUxShell>
  );
}
