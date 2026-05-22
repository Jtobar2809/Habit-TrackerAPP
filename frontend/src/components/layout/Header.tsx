import { motion } from 'framer-motion';
import { ChevronDown, UserCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useUsers } from '@/context/UserContext';
import { cn } from '@/lib/cn';

interface Props {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: Props) {
  const { users, currentUser, setCurrentUser } = useUsers();
  const [open, setOpen] = useState(false);

  return (
    <header className="px-6 lg:px-10 pt-6 lg:pt-8 pb-4 flex items-end justify-between gap-4">
      <div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-ember-300 uppercase tracking-widest mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{subtitle ?? 'Tu progreso, en tiempo real'}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl lg:text-4xl font-bold leading-tight"
        >
          {title}
        </motion.h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass rounded-xl px-3 py-2 flex items-center gap-3 hover:bg-ink-800/80 transition-colors ring-focus"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ember-500 to-ember-700 flex items-center justify-center text-white text-sm font-semibold shadow-glow">
            {currentUser ? initials(currentUser.name) : <UserCircle2 className="w-5 h-5" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-ink-100 leading-none">
              {currentUser?.name ?? 'Sin usuario'}
            </div>
            <div className="text-[11px] text-ink-400 mt-1 leading-none">
              {currentUser?.email ?? 'Selecciona uno'}
            </div>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-ink-400 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-2 w-72 glass-strong rounded-xl shadow-glow-lg z-40 overflow-hidden"
            >
              <div className="px-3 py-2 text-[11px] uppercase tracking-widest text-ink-400 border-b border-white/5">
                Cambiar usuario
              </div>
              <div className="max-h-72 overflow-y-auto">
                {users.length === 0 && (
                  <div className="px-4 py-6 text-sm text-ink-400 text-center">
                    No hay usuarios. Crea uno en la sección Usuarios.
                  </div>
                )}
                {users.map((u) => {
                  const active = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors hover:bg-white/5',
                        active && 'bg-ember-500/10',
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-ink-800 flex items-center justify-center text-xs font-semibold text-ink-100 border border-white/5">
                        {initials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-ink-100 truncate">{u.name}</div>
                        <div className="text-[11px] text-ink-400 truncate">{u.email}</div>
                      </div>
                      {active && <span className="text-[10px] text-ember-300 uppercase tracking-wider">Activo</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
