import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  AlertCircle,
  Calculator,
  Info
} from 'lucide-react';
import { DashboardMetrics } from '../../types/provider';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
  activeFocus: 'all' | 'providers' | 'certifications' | 'reviews';
  onSelectFocus: (focus: 'all' | 'providers' | 'certifications' | 'reviews') => void;
}

interface TrendCalculationDetails {
  currentValue: number;
  priorValue: number;
  rawDelta: number;
  formula: string;
  description: string;
}

interface TrendBadgeProps {
  percent: number;
  label?: string;
  isBacklogMetric?: boolean;
  metricName: string;
  details: TrendCalculationDetails;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({
  percent,
  label = 'from last week',
  isBacklogMetric = false,
  metricName,
  details,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isPositive = percent > 0;
  const isZero = percent === 0;

  // In standard metrics (providers, certs), positive is green.
  // In backlog metrics (pending reviews queue), negative is green (workload decreased/cleared) and positive is amber (queue expanded).
  const isDesirable = isBacklogMetric ? percent <= 0 : percent >= 0;

  const colorStyles = isZero
    ? 'text-slate-600 bg-slate-50 border-slate-200'
    : isDesirable
    ? 'text-emerald-700 bg-emerald-50/90 border-emerald-200/70 hover:bg-emerald-100/90'
    : 'text-amber-700 bg-amber-50/90 border-amber-200/70 hover:bg-amber-100/90';

  const tooltipId = `tooltip-${metricName.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <div
        role="button"
        tabIndex={0}
        aria-describedby={tooltipId}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onFocus={() => setIsTooltipOpen(true)}
        onBlur={() => setIsTooltipOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsTooltipOpen(false);
          }
        }}
        className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border font-mono tabular-nums cursor-help transition-colors select-none ${colorStyles}`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" aria-hidden="true" />
        ) : percent < 0 ? (
          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" aria-hidden="true" />
        ) : null}
        <span>
          {isPositive ? `+${percent}%` : `${percent}%`} {label}
        </span>
        <Info className="w-3 h-3 ml-1 opacity-60 shrink-0" aria-hidden="true" />
      </div>

      {/* Hover & Focus Calculation Tooltip */}
      {isTooltipOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full right-0 mb-2.5 z-40 w-72 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              Trend Calculation Logic
            </span>
            <span className="text-[10px] text-slate-400 font-mono">7-Day Rolling</span>
          </div>

          {/* Mathematical Formula Box */}
          <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[11px] font-mono text-blue-300 mb-2.5">
            <div className="text-[10px] text-slate-400 font-sans mb-0.5 uppercase tracking-wider">Mathematical Formula</div>
            <div className="text-slate-100 font-semibold">{details.formula}</div>
          </div>

          {/* Raw Values Breakdown */}
          <div className="space-y-1 text-[11px] font-mono border-b border-slate-800 pb-2 mb-2">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Current Week (T):</span>
              <span className="font-semibold text-white tabular-nums">{details.currentValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Prior Week (T - 7d):</span>
              <span className="font-semibold text-white tabular-nums">{details.priorValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Net Delta (Δ):</span>
              <span className={`font-semibold tabular-nums ${details.rawDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {details.rawDelta >= 0 ? `+${details.rawDelta.toLocaleString()}` : details.rawDelta.toLocaleString()} ({percent > 0 ? `+${percent}%` : `${percent}%`})
              </span>
            </div>
          </div>

          {/* Plain English Operational Context */}
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            {details.description}
          </p>

          {/* Caret / Arrow */}
          <div 
            className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 transform rotate-45" 
            aria-hidden="true" 
          />
        </div>
      )}
    </div>
  );
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  activeFocus,
  onSelectFocus,
}) => {
  // Precompute raw calculation details for Total Providers
  const currentProviders = metrics.totalProviders.count;
  const priorProviders = 2788;
  const providersDelta = currentProviders - priorProviders;
  const providersFormula = `((${currentProviders.toLocaleString()} - ${priorProviders.toLocaleString()}) ÷ ${priorProviders.toLocaleString()}) × 100 = +${metrics.totalProviders.weekTrendPercent}%`;

  // Precompute raw calculation details for Active Certifications
  const currentCerts = metrics.activeCertifications.count;
  const priorCerts = 4047;
  const certsDelta = currentCerts - priorCerts;
  const certsFormula = `((${currentCerts.toLocaleString()} - ${priorCerts.toLocaleString()}) ÷ ${priorCerts.toLocaleString()}) × 100 = +${metrics.activeCertifications.weekTrendPercent}%`;

  // Precompute raw calculation details for Pending Reviews
  const currentReviews = metrics.pendingReviews.totalQueueCount;
  const priorReviews = 145;
  const reviewsDelta = currentReviews - priorReviews;
  const reviewsFormula = `((${currentReviews} - ${priorReviews}) ÷ ${priorReviews}) × 100 = ${metrics.pendingReviews.weekTrendPercent}%`;

  return (
    <section aria-label="Executive KPI Overview" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Providers */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectFocus(activeFocus === 'providers' ? 'all' : 'providers')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectFocus(activeFocus === 'providers' ? 'all' : 'providers');
            }
          }}
          className={`text-left bg-white rounded-xl p-5 border transition-all duration-200 cursor-pointer relative ${
            activeFocus === 'providers'
              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
          aria-pressed={activeFocus === 'providers'}
          aria-label={`Total Providers: ${metrics.totalProviders.count.toLocaleString()}. Click to filter view.`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Total Providers Enrolled
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
              {metrics.totalProviders.count.toLocaleString()}
            </span>
            <TrendBadge 
              percent={metrics.totalProviders.weekTrendPercent} 
              label="from last week" 
              metricName="Total Providers"
              details={{
                currentValue: currentProviders,
                priorValue: priorProviders,
                rawDelta: providersDelta,
                formula: providersFormula,
                description: 'Derived by dividing the 7-day net newly approved providers by the prior week active baseline of 2,788 practitioners and facilities.',
              }}
            />
          </div>

          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center text-xs text-slate-500 gap-1.5 mb-3 font-normal">
            <span className="text-slate-700 font-medium font-mono tabular-nums">
              {metrics.totalProviders.activeCount.toLocaleString()}
            </span>
            <span>Active</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">{metrics.totalProviders.pendingCount}</span>
            <span>In Review</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">{metrics.totalProviders.suspendedCount}</span>
            <span>Suspended</span>
          </div>

          {/* Bottom Breakdown Sub-row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.totalProviders.breakdown.individuals.toLocaleString()}
              </strong>{' '}
              Individual MD/DO
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.totalProviders.breakdown.groups}
              </strong>{' '}
              Groups
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.totalProviders.breakdown.facilities}
              </strong>{' '}
              Facilities
            </span>
          </div>
        </div>

        {/* Card 2: Active Certifications */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectFocus(activeFocus === 'certifications' ? 'all' : 'certifications')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectFocus(activeFocus === 'certifications' ? 'all' : 'certifications');
            }
          }}
          className={`text-left bg-white rounded-xl p-5 border transition-all duration-200 cursor-pointer relative ${
            activeFocus === 'certifications'
              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
          aria-pressed={activeFocus === 'certifications'}
          aria-label={`Active Certifications: ${metrics.activeCertifications.count.toLocaleString()}. Click to filter view.`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Active Certifications & Licenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Award className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
              {metrics.activeCertifications.count.toLocaleString()}
            </span>
            <TrendBadge 
              percent={metrics.activeCertifications.weekTrendPercent} 
              label="from last week" 
              metricName="Active Certifications"
              details={{
                currentValue: currentCerts,
                priorValue: priorCerts,
                rawDelta: certsDelta,
                formula: certsFormula,
                description: 'Calculates the net change in verified medical licenses, DEA registrations, and board certifications over the prior 7-day count (4,047).',
              }}
            />
          </div>

          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center text-xs text-slate-500 gap-1.5 mb-3 font-normal">
            <span className="text-emerald-700 font-medium">
              {metrics.activeCertifications.verifiedPercent}% PSV Verified
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-amber-700 font-medium font-mono tabular-nums">
              {metrics.activeCertifications.expiringIn30Days}
            </span>
            <span className="text-amber-700">due in 30d</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">{metrics.activeCertifications.expiringIn60Days}</span>
            <span>in 60d</span>
          </div>

          {/* Bottom Breakdown Sub-row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.activeCertifications.breakdown.stateLicenses.toLocaleString()}
              </strong>{' '}
              State Licenses
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.activeCertifications.breakdown.deaRegistrations}
              </strong>{' '}
              DEA
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.activeCertifications.breakdown.boardCertifications}
              </strong>{' '}
              Board Certs
            </span>
          </div>
        </div>

        {/* Card 3: Pending Reviews */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectFocus(activeFocus === 'reviews' ? 'all' : 'reviews')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectFocus(activeFocus === 'reviews' ? 'all' : 'reviews');
            }
          }}
          className={`text-left bg-white rounded-xl p-5 border transition-all duration-200 cursor-pointer relative ${
            activeFocus === 'reviews'
              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
          aria-pressed={activeFocus === 'reviews'}
          aria-label={`Pending Reviews Queue: ${metrics.pendingReviews.totalQueueCount}. Click to focus review queue.`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Pending Reviews & Applications
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
              {metrics.pendingReviews.totalQueueCount}
            </span>
            <TrendBadge 
              percent={metrics.pendingReviews.weekTrendPercent} 
              label="from last week" 
              isBacklogMetric={true} 
              metricName="Pending Reviews"
              details={{
                currentValue: currentReviews,
                priorValue: priorReviews,
                rawDelta: reviewsDelta,
                formula: reviewsFormula,
                description: 'Measures queue backlog velocity. A negative percentage signifies healthy throughput where processed and approved items exceed new inbound applications.',
              }}
            />
          </div>

          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center text-xs text-slate-500 gap-1.5 mb-3 font-normal">
            <span className="text-emerald-700 font-medium font-mono tabular-nums">
              {metrics.pendingReviews.slaComplianceRate}%
            </span>
            <span className="text-emerald-700">CMS SLA Met</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">{metrics.pendingReviews.breakdown.initialEnrollments}</span>
            <span>Initial</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">{metrics.pendingReviews.breakdown.eftVerifications}</span>
            <span>EFT Pre-notes</span>
          </div>

          {/* Bottom Breakdown Sub-row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.pendingReviews.breakdown.recredentialing}
              </strong>{' '}
              Renewals
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.pendingReviews.breakdown.addressChanges}
              </strong>{' '}
              Address Changes
            </span>
            <span>
              <strong className="text-slate-700 font-medium font-mono tabular-nums">
                {metrics.pendingReviews.breakdown.chowTransactions}
              </strong>{' '}
              CHOW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
