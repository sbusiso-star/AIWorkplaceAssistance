import { NAV_ITEMS, type ViewId } from '@/lib/nav';
import { Sparkles, X } from 'lucide-react';

interface SidebarProps {
  current: ViewId;
  onNavigate: (id: ViewId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 border-r border-ink-200 bg-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-2 px-5 h-16 border-b border-ink-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-semibold text-ink-900">FlowPilot</p>
              <p className="text-[11px] text-ink-400">AI Productivity</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-ink-400 hover:text-ink-700"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Workspace</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    active ? 'text-primary-600' : 'text-ink-400 group-hover:text-ink-600'
                  }`}
                />
                <span>{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />}
              </button>
            );
          })}
        </nav>

        {/* Footer card */}
        <div className="p-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white shadow-soft">
            <p className="text-sm font-semibold">Pro Tip</p>
            <p className="mt-1 text-xs text-primary-100 leading-relaxed">
              Combine tools — draft an email from your meeting summary, then plan the follow-up tasks.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
