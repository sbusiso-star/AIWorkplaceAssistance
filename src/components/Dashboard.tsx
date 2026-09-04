import { NAV_ITEMS, type ViewId } from '@/lib/nav';
import { Card, Disclaimer } from '@/components/ui';
import { Sparkles, ArrowRight, Clock, Zap, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigate: (id: ViewId) => void;
}

const stats = [
  { label: 'Emails Drafted', value: '12', icon: Zap, trend: '+3 this week' },
  { label: 'Meetings Summarized', value: '8', icon: Clock, trend: '+2 this week' },
  { label: 'Tasks Planned', value: '24', icon: TrendingUp, trend: '+7 this week' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-primary-900 to-primary-700 p-6 sm:p-8 text-white shadow-lift">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -right-20 top-20 h-40 w-40 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI Workplace Productivity Assistant
          </div>
          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-semibold leading-tight max-w-xl">
            Automate your daily work with structured AI.
          </h1>
          <p className="mt-2 max-w-lg text-sm text-primary-100/90 leading-relaxed">
            Draft polished emails, summarize meetings, plan your day, research topics, and chat with an AI assistant — all in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('email')}
              className="btn bg-white text-primary-700 hover:bg-primary-50 px-4 py-2.5 text-sm font-semibold"
            >
              Draft an Email <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="btn bg-white/10 text-white hover:bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur"
            >
              Ask the Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold font-display text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-500">{s.label}</p>
                <p className="text-[11px] text-accent-600 mt-0.5">{s.trend}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-900 mb-3">AI Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {NAV_ITEMS.filter((n) => n.id !== 'dashboard').map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group card p-5 text-left transition-all hover:shadow-lift hover:border-primary-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="mt-3.5 font-semibold text-ink-900">{item.label}</h4>
                <p className="mt-1 text-sm text-ink-500 leading-relaxed">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
