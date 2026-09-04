import { type ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          {icon}
        </div>
      )}
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Badge({
  children,
  color = 'primary',
}: {
  children: ReactNode;
  color?: 'primary' | 'accent' | 'amber' | 'rose' | 'slate';
}) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-50 text-accent-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    slate: 'bg-ink-100 text-ink-600',
  };
  return <span className={`chip ${colors[color]}`}>{children}</span>;
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  };
  return (
    <button onClick={handleCopy} className="btn-ghost px-2.5 py-1.5 text-xs">
      {label}
    </button>
  );
}

export function LoadingDots({ label = 'Thinking' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-500">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0s' }} />
        <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0.15s' }} />
        <span className="h-2 w-2 rounded-full bg-primary-500 animate-dot-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function SkeletonLines({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-bg h-3.5 rounded relative overflow-hidden"
          style={{ width: `${[100, 92, 85, 96, 70][i % 5]}%` }}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      ))}
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50/70 border border-amber-200/70 px-3 py-2 text-xs text-amber-800">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span>AI-generated content may require human review.</span>
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-10 text-center">
      {icon && <div className="mb-3 text-ink-300">{icon}</div>}
      <p className="text-sm font-medium text-ink-600">{title}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
