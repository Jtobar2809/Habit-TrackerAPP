import { useEffect, useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';
import type { UserPayload } from '@/api/users';

interface Props {
  initial?: User | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: UserPayload) => Promise<void> | void;
}

export function UserForm({ initial, loading, onCancel, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
    setErrors({});
  }, [initial]);

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    const nameT = name.trim();
    const emailT = email.trim();
    const next: typeof errors = {};
    if (!nameT) next.name = 'El nombre es obligatorio.';
    else if (nameT.length > 200) next.name = 'Máximo 200 caracteres.';
    if (!emailT || !emailT.includes('@')) next.email = 'Email inválido.';
    setErrors(next);
    if (Object.keys(next).length) return;
    await onSubmit({ name: nameT, email: emailT });
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Jonathan Tobar"
        autoFocus
      />
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        type="email"
        placeholder="tu@email.com"
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Guardar' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}
