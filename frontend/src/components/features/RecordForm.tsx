import { useEffect, useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Habito, RegistroHabito } from '@/types';
import type { RegistroPayload } from '@/api/registros';

interface Props {
  habitos: Habito[];
  initial?: RegistroHabito | null;
  loading?: boolean;
  defaultHabitId?: number;
  onCancel: () => void;
  onSubmit: (payload: RegistroPayload) => Promise<void> | void;
}

function toInputDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function RecordForm({ habitos, initial, loading, defaultHabitId, onCancel, onSubmit }: Props) {
  const [idHabito, setIdHabito] = useState<number>(initial?.idHabito ?? defaultHabitId ?? habitos[0]?.id ?? 0);
  const [fecha, setFecha] = useState<string>(toInputDate(initial?.fecha));
  const [cumplido, setCumplido] = useState<boolean>(initial?.cumplido ?? true);

  useEffect(() => {
    setIdHabito(initial?.idHabito ?? defaultHabitId ?? habitos[0]?.id ?? 0);
    setFecha(toInputDate(initial?.fecha));
    setCumplido(initial?.cumplido ?? true);
  }, [initial, defaultHabitId, habitos]);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    if (!idHabito) return;
    await onSubmit({
      idHabito,
      fecha: `${fecha}T00:00:00`,
      cumplido,
    });
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <label className="block">
        <span className="text-xs font-medium text-ink-300 mb-1.5 block uppercase tracking-wider">Hábito</span>
        <select
          value={idHabito}
          onChange={(e) => setIdHabito(Number(e.target.value))}
          className="w-full bg-ink-900/60 border border-white/10 rounded-xl px-4 h-11 text-sm text-ink-100 focus:border-ember-500/60 focus:shadow-glow ring-focus appearance-none"
        >
          {habitos.length === 0 && <option value={0}>No hay hábitos disponibles</option>}
          {habitos.map((h) => (
            <option key={h.id} value={h.id}>
              {h.nombre}
            </option>
          ))}
        </select>
      </label>

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCumplido(true)}
          className={`flex-1 rounded-xl py-3 text-sm font-medium border transition-all ring-focus ${
            cumplido
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-700/5 border-emerald-500/40 text-emerald-300 shadow-glow'
              : 'bg-ink-900/40 border-white/5 text-ink-400 hover:text-ink-100'
          }`}
        >
          ✓ Cumplido
        </button>
        <button
          type="button"
          onClick={() => setCumplido(false)}
          className={`flex-1 rounded-xl py-3 text-sm font-medium border transition-all ring-focus ${
            !cumplido
              ? 'bg-gradient-to-br from-ember-500/20 to-ember-700/5 border-ember-500/40 text-ember-300 shadow-glow'
              : 'bg-ink-900/40 border-white/5 text-ink-400 hover:text-ink-100'
          }`}
        >
          ✕ No cumplido
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading} disabled={!idHabito}>
          {initial ? 'Guardar' : 'Registrar'}
        </Button>
      </div>
    </form>
  );
}
