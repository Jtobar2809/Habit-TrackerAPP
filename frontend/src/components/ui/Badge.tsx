import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'success' | 'danger' | 'warn' | 'ember';

const variants: Record<Variant, string> = {
  default: 'bg-white/5 text-ink-200 border-white/10',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  danger:  'bg-ember-500/10 text-ember-300 border-ember-500/40',
  warn:    'bg-amber-500/10 text-amber-300 border-amber-500/30',
  ember:   'bg-gradient-to-br from-ember-500/20 to-ember-700/20 text-ember-200 border-ember-500/40',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
