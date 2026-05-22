import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-ember-500/20 blur-3xl rounded-full" />
        <div className="relative bg-gradient-to-br from-ember-500/20 to-ember-700/10 border border-ember-500/30 rounded-2xl p-5">
          <Icon className="w-8 h-8 text-ember-300" />
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-50 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-400 max-w-sm mb-5">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
