import { useEffect, useState, type FormEvent } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Habito } from '@/types';
import type { HabitoPayload } from '@/api/habitos';

interface Props {
  initial?: Habito | null;
  idUsuario: number;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: HabitoPayload) => Promise<void> | void;
}

export function HabitForm({ initial, idUsuario, loading, onCancel, onSubmit }: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState<{ nombre?: string }>({});

  useEffect(() => {
    setNombre(initial?.nombre ?? '');
    setDescripcion(initial?.descripcion ?? '');
    setActivo(initial?.activo ?? true);
    setErrors({});
  }, [initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nombre.trim();
    if (!trimmed) {
      setErrors({ nombre: 'El nombre es obligatorio.' });
      return;
    }
    if (trimmed.length > 200) {
      setErrors({ nombre: 'Máximo 200 caracteres.' });
      return;
    }
    await onSubmit({
      nombre: trimmed,
      descripcion: descripcion.trim(),
      activo,
      idUsuario,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del hábito"
        placeholder="Ej: Leer 20 minutos"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={errors.nombre}
        autoFocus
      />
      <Textarea
        label="Descripción"
        placeholder="¿En qué consiste? ¿Cuándo lo harás?"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label className="flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer">
        <div>
          <div className="text-sm font-medium text-ink-100">Hábito activo</div>
          <div className="text-xs text-ink-400 mt-0.5">Aparecerá en tu dashboard de seguimiento.</div>
        </div>
        <Switch checked={activo} onChange={setActivo} />
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Guardar cambios' : 'Crear hábito'}
        </Button>
      </div>
    </form>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ring-focus ${
        checked ? 'bg-gradient-to-r from-ember-500 to-ember-700 shadow-glow' : 'bg-ink-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
