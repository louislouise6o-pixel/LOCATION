import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export function Banner({ children, tone = 'amber' }: { children: ReactNode; tone?: 'amber' | 'ocean' | 'navy' }) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    ocean: 'bg-ocean-50 border-ocean-200 text-ocean-800',
    navy: 'bg-navy-50 border-navy-100 text-navy-800',
  };
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-wider text-ocean-500">{eyebrow}</span>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-extrabold text-navy-800 mt-2">{title}</h1>
      {subtitle && <p className="mt-2 text-navy-600 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-16 w-16 rounded-2xl bg-mist-100 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-mist-400" />
      </div>
      <h3 className="font-display font-bold text-xl text-navy-800">{title}</h3>
      <p className="mt-2 text-navy-600 max-w-md">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = 'navy',
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  tone?: 'navy' | 'ocean' | 'amber' | 'emerald';
}) {
  const tones: Record<string, string> = {
    navy: 'from-navy-700 to-navy-800 text-white',
    ocean: 'from-ocean-400 to-ocean-500 text-white',
    amber: 'from-amber-400 to-amber-500 text-white',
    emerald: 'from-emerald-400 to-emerald-500 text-white',
  };
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${tones[tone]} shadow-card`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
          <p className="font-display font-extrabold text-2xl mt-1.5">{value}</p>
          {sub && <p className="text-xs opacity-80 mt-1">{sub}</p>}
        </div>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
    </div>
  );
}
