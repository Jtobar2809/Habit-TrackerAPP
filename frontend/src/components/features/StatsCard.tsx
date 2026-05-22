import { motion } from 'framer-motion';
import { Flame, Trash2 } from 'lucide-react';
import type { EstadisticaHabito } from '@/types';
import { Button } from '@/components/ui/Button';

interface Props {
  stat: EstadisticaHabito;
  habitName?: string;
  index?: number;
  onDelete: (s: EstadisticaHabito) => void;
}

export function StatsCard({ stat, habitName, index = 0, onDelete }: Props) {
  const pct = clamp(stat.porcentaje, 0, 100);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="glass rounded-2xl p-5 hover:border-ember-500/30 hover:shadow-glow transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-ember-300 font-semibold mb-1">
            Hábito #{stat.idHabito}
          </div>
          <div className="font-display text-lg font-semibold text-ink-50 truncate">
            {habitName ?? 'Sin nombre'}
          </div>
        </div>
        <Button variant="danger" size="icon" onClick={() => onDelete(stat)} aria-label="Eliminar">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Mini label="Días cumplidos" value={stat.diasCumplidos} />
        <Mini
          label="Racha actual"
          value={stat.rachaActual}
          icon={<Flame className="w-3.5 h-3.5 text-ember-300" />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-ink-300 mb-2">
          <span>Cumplimiento</span>
          <span className="font-semibold text-ink-50">{pct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-ember-400 via-ember-500 to-ember-700 shadow-glow"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="bg-ink-900/40 rounded-xl p-3 border border-white/5">
      <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-1 flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="font-display text-2xl font-semibold text-ink-50">{value}</div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
