import { motion } from 'framer-motion';
import { Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { RegistroHabito } from '@/types';

interface Props {
  registro: RegistroHabito;
  habitName?: string;
  onToggle: (r: RegistroHabito) => void;
  onDelete: (r: RegistroHabito) => void;
  index?: number;
}

export function RecordRow({ registro, habitName, onToggle, onDelete, index = 0 }: Props) {
  const date = new Date(registro.fecha);
  const dateLabel = isNaN(date.getTime()) ? registro.fecha : date.toLocaleDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      className="glass rounded-xl p-4 flex items-center gap-4 hover:border-ember-500/30 hover:shadow-glow transition-all"
    >
      <button
        onClick={() => onToggle(registro)}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ring-focus ${
          registro.cumplido
            ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-700/10 border border-emerald-500/40 text-emerald-300 shadow-glow'
            : 'bg-ink-800/80 border border-white/10 text-ink-400 hover:text-ink-100'
        }`}
        aria-label={registro.cumplido ? 'Marcar como no cumplido' : 'Marcar como cumplido'}
      >
        {registro.cumplido ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-ink-100">{habitName ?? `Hábito #${registro.idHabito}`}</span>
          <Badge variant={registro.cumplido ? 'success' : 'danger'}>
            {registro.cumplido ? 'Cumplido' : 'No cumplido'}
          </Badge>
        </div>
        <div className="text-xs text-ink-400 mt-1">{dateLabel}</div>
      </div>

      <Button variant="danger" size="icon" onClick={() => onDelete(registro)} aria-label="Eliminar">
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
