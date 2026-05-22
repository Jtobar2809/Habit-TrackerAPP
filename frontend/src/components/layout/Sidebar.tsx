import { motion } from 'framer-motion';
import { Flame, LayoutDashboard, ListChecks, CalendarCheck, BarChart3, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

export type RouteKey = 'dashboard' | 'habits' | 'records' | 'stats' | 'users';

interface NavItem {
  key: RouteKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const items: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'habits',    label: 'Hábitos',     icon: ListChecks },
  { key: 'records',   label: 'Registros',   icon: CalendarCheck },
  { key: 'stats',     label: 'Estadísticas',icon: BarChart3 },
  { key: 'users',     label: 'Usuarios',    icon: Users },
];

interface Props {
  current: RouteKey;
  onChange: (key: RouteKey) => void;
}

export function Sidebar({ current, onChange }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 bg-ink-950/50 backdrop-blur-xl">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-ember-500/40 blur-xl rounded-full" />
          <div className="relative bg-gradient-to-br from-ember-500 to-ember-700 p-2 rounded-xl shadow-glow">
            <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <div className="font-display text-lg font-bold leading-none gradient-text">Ember</div>
          <div className="text-[11px] text-ink-400 uppercase tracking-widest mt-1">Habit Tracker</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {items.map((it) => {
          const active = current === it.key;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ring-focus text-left',
                active ? 'text-ink-50' : 'text-ink-300 hover:text-ink-100 hover:bg-white/5',
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-ember-500/20 to-ember-700/5 border border-ember-500/30 rounded-xl shadow-glow"
                  transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                />
              )}
              <Icon className={cn('w-4 h-4 relative', active && 'text-ember-300')} />
              <span className="relative">{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-ink-300">v1.0.0 · Ember</div>
          <div className="text-[11px] text-ink-500 mt-1">Construye hábitos con fuego</div>
        </div>
      </div>
    </aside>
  );
}
