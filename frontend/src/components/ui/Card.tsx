import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

type CardProps = HTMLMotionProps<'div'> & {
  hoverable?: boolean;
};

export function Card({ hoverable, className, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hoverable ? { y: -3, transition: { type: 'spring', stiffness: 300 } } : undefined}
      className={cn(
        'glass rounded-2xl p-5 transition-shadow',
        hoverable && 'hover:shadow-glow hover:border-ember-500/30',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
