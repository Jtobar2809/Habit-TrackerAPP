import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-ember-500 via-ember-600 to-ember-700 text-white hover:shadow-glow-lg shadow-glow',
  secondary:
    'bg-ink-800/80 text-ink-100 border border-white/10 hover:bg-ink-700/80',
  ghost:
    'bg-transparent text-ink-200 hover:bg-white/5',
  outline:
    'bg-transparent text-ember-300 border border-ember-500/40 hover:bg-ember-500/10',
  danger:
    'bg-ember-700/20 text-ember-300 border border-ember-500/30 hover:bg-ember-700/30',
};

const sizes: Record<Size, string> = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md:   'h-10 px-4 text-sm gap-2 rounded-xl',
  lg:   'h-12 px-6 text-base gap-2 rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
};

type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors ring-focus disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';
