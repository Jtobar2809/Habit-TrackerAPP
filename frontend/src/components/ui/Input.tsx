import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

const fieldClasses =
  'w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 h-11 text-sm text-ink-100 placeholder:text-ink-400 transition-all duration-200 focus:border-ember-500/60 focus:bg-ink-900/90 focus:shadow-glow ring-focus';

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, ...props }, ref) => (
    <label className={cn('block', className)}>
      {label && (
        <span className="text-xs font-medium text-ink-300 mb-1.5 block uppercase tracking-wider">
          {label}
        </span>
      )}
      <input
        ref={ref}
        className={cn(fieldClasses, error && 'border-ember-500/60')}
        {...props}
      />
      {error ? (
        <span className="text-xs text-ember-400 mt-1.5 block">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-400 mt-1.5 block">{hint}</span>
      ) : null}
    </label>
  ),
);
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, ...props }, ref) => (
    <label className={cn('block', className)}>
      {label && (
        <span className="text-xs font-medium text-ink-300 mb-1.5 block uppercase tracking-wider">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-ink-100 placeholder:text-ink-400 transition-all duration-200 focus:border-ember-500/60 focus:bg-ink-900/90 focus:shadow-glow ring-focus resize-none min-h-[88px]',
          error && 'border-ember-500/60',
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-ember-400 mt-1.5 block">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ink-400 mt-1.5 block">{hint}</span>
      ) : null}
    </label>
  ),
);
Textarea.displayName = 'Textarea';
