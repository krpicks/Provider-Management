import React from 'react';
import { 
  Building2, 
  Search, 
  Users, 
  Award, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  History, 
  BarChart3, 
  Plus, 
  ChevronDown, 
  HelpCircle,
  Bell,
  Layers
} from 'lucide-react';

interface CoreUxShellProps {
  children: React.ReactNode;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenQuickSearch: () => void;
  onOpenNewEnrollment: () => void;
  currentTenant: string;
  onChangeTenant: (tenant: string) => void;
}

export const CoreUxShell: React.FC<CoreUxShellProps> = ({
  children,
  activeNav,
  onSelectNav,
  onOpenQuickSearch,
  onOpenNewEnrollment,
  currentTenant,
  onChangeTenant,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'search', label: 'Provider Search & Roster', icon: Users },
    { id: 'master', label: 'Provider Master Directory', icon: Building2 },
    { id: 'credentials', label: 'Credentialing & PSV', icon: Award },
    { id: 'financials', label: 'Financials & EFT Waivers', icon: CreditCard },
    { id: 'transactions', label: 'Transactions (PRN / CHOW)', icon: FileText },
    { id: 'audit', label: 'Audit Trail & Compliance', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar - Strict 3-zone contract */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 sticky top-0 z-40">
        {/* Zone 1: Brand Wordmark and Context */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              P+
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Provider Plus
            </span>
          </div>

          <div className="hidden md:flex items-center text-xs text-slate-400 gap-1.5 font-normal">
            <span>CMS-PM</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium capitalize">{activeNav.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Zone 2: Search trigger & Tenant Context */}
        <div className="flex items-center gap-4 max-w-md w-full justify-center">
          <button
            type="button"
            onClick={onOpenQuickSearch}
            className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Quick search provider by NPI or name (Shortcut: Command K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className="truncate">Quick search NPI, Name, or Tax ID...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Zone 3: Tenant Selector, Operator Profile, Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tenant Selector */}
          <div className="relative hidden lg:block">
            <select
              value={currentTenant}
              onChange={(e) => onChangeTenant(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
              aria-label="Active Medicaid / Health Plan Tenant"
            >
              <option value="OH-MED-01">Ohio Medicaid (OH-MED-01)</option>
              <option value="FL-AHCA-02">Florida AHCA (FL-AHCA-02)</option>
              <option value="TX-HHSC-03">Texas HHSC (TX-HHSC-03)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenNewEnrollment}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Enroll Provider</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center">
              SJ
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <span className="font-semibold text-slate-900 block">S. Jenkins</span>
              <span className="text-[11px] text-slate-400">Lead Credentialing</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body with Sidebar and Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside 
          className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0"
          aria-label="CMS-PM Module Navigation"
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Provider Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer System Info */}
          <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-600">State Tenant</span>
              <span className="font-mono text-slate-500">{currentTenant}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Standards</span>
              <span className="text-slate-500">WCAG 2.2 AA · FAPI 2.0</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
