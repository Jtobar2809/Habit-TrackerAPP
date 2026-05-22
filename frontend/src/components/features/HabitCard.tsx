import { motion } from 'framer-motion';
import { Flame, Pencil, Trash2, Power } from 'lucide-react';
import type { Habito } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Props {
  habito: Habito;
  onEdit: (h: Habito) => void;
  onDelete: (h: Habito) => void;
  onToggleActive: (h: Habito) => void;
  index?: number;
}

export function HabitCard({ habito, onEdit, onDelete, onToggleActive, index = 0 }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="relative glass rounded-2xl p-5 group hover:border-ember-500/30 hover:shadow-glow transition-all overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-ember-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-ember-500/30 blur-lg rounded-xl" />
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-ember-500/20 to-ember-700/10 border border-ember-500/30">
              <Flame className="w-5 h-5 text-ember-300" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-ink-50 truncate">{habito.nombre}</h3>
            <p className="text-sm text-ink-400 mt-0.5 line-clamp-2">
              {habito.descripcion || <span className="italic text-ink-500">Sin descripción</span>}
            </p>
          </div>
        </div>
        <Badge variant={habito.activo ? 'success' : 'default'}>
          {habito.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-ink-400">
        <span>Creado · {new Date(habito.fechaCreacion).toLocaleDateString()}</span>
        {habito.user && <span className="truncate ml-2">@{habito.user.name}</span>}
      </div>

      <div className="relative mt-4 flex items-center gap-2 pt-4 border-t border-white/5">
        <Button size="sm" variant="ghost" onClick={() => onToggleActive(habito)}>
          <Power className="w-3.5 h-3.5" />
          {habito.activo ? 'Pausar' : 'Activar'}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onEdit(habito)}>
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(habito)} className="ml-auto">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.article>
  );
}
