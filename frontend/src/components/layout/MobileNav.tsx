import { motion } from 'framer-motion';
import { LayoutDashboard, ListChecks, CalendarCheck, BarChart3, Users } from 'lucide-react';
import type { RouteKey } from './Sidebar';
import { cn } from '@/lib/cn';

const items: { key: RouteKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Inicio',   icon: LayoutDashboard },
  { key: 'habits',    label: 'Hábitos',  icon: ListChecks },
  { key: 'records',   label: 'Registros',icon: CalendarCheck },
  { key: 'stats',     label: 'Stats',    icon: BarChart3 },
  { key: 'users',     label: 'Users',    icon: Users },
];

interface Props {
  current: RouteKey;
  onChange: (key: RouteKey) => void;
}

export function MobileNav({ current, onChange }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 glass-strong rounded-2xl shadow-glow-lg p-1.5 grid grid-cols-5 gap-1">
      {items.map(({ key, label, icon: Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'relative flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-medium transition-colors ring-focus',
              active ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100',
            )}
          >
            {active && (
              <motion.div
                layoutId="mobile-active"
                className="absolute inset-0 bg-gradient-to-br from-ember-500/30 to-ember-700/10 border border-ember-500/40 rounded-xl"
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              />
            )}
            <Icon className={cn('w-4 h-4 relative', active && 'text-ember-300')} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
