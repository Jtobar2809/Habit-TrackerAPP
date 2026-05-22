import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: 'ember' | 'emerald' | 'amber' | 'sky';
  delay?: number;
}

const accents = {
  ember:   'from-ember-500/30 to-ember-700/10 text-ember-300 border-ember-500/40',
  emerald: 'from-emerald-500/20 to-emerald-700/5 text-emerald-300 border-emerald-500/30',
  amber:   'from-amber-500/20 to-amber-700/5 text-amber-300 border-amber-500/30',
  sky:     'from-sky-500/20 to-sky-700/5 text-sky-300 border-sky-500/30',
};

export function StatCard({ label, value, hint, icon: Icon, accent = 'ember', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-ember-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-start justify-between mb-4 relative">
        <span className="text-xs uppercase tracking-wider text-ink-400 font-medium">{label}</span>
        <div className={cn('p-2 rounded-xl border bg-gradient-to-br', accents[accent])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="font-display text-3xl font-semibold text-ink-50 relative">{value}</div>
      {hint && <div className="text-xs text-ink-400 mt-1 relative">{hint}</div>}
    </motion.div>
  );
}
