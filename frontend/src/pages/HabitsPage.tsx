import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ListChecks, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HabitCard } from '@/components/features/HabitCard';
import { HabitForm } from '@/components/features/HabitForm';
import { useUsers } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { habitosApi, type HabitoPayload } from '@/api/habitos';
import type { Habito } from '@/types';

type Filter = 'all' | 'active' | 'inactive';

export function HabitsPage() {
  const { currentUser } = useUsers();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState<Habito | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Habito | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, loading, refetch } = useAsync(
    () => (currentUser ? habitosApi.byUser(currentUser.id) : Promise.resolve([])),
    [currentUser?.id],
  );

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list
      .filter((h) => (filter === 'all' ? true : filter === 'active' ? h.activo : !h.activo))
      .filter((h) =>
        query.trim()
          ? h.nombre.toLowerCase().includes(query.toLowerCase()) ||
            h.descripcion.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [data, filter, query]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Hábitos" />
        <PageContainer>
          <EmptyState icon={ListChecks} title="Selecciona un usuario" description="Necesitas un usuario activo." />
        </PageContainer>
      </div>
    );
  }

  const handleCreate = async (payload: HabitoPayload) => {
    setSaving(true);
    try {
      await habitosApi.create(payload);
      toast.success('Hábito creado');
      setCreating(false);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload: HabitoPayload) => {
    if (!editing) return;
    setSaving(true);
    try {
      await habitosApi.update(editing.id, payload);
      toast.success('Hábito actualizado');
      setEditing(null);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (h: Habito) => {
    try {
      await habitosApi.update(h.id, {
        nombre: h.nombre,
        descripcion: h.descripcion,
        activo: !h.activo,
        idUsuario: h.idUsuario,
      });
      toast.success(h.activo ? 'Hábito pausado' : 'Hábito activado');
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await habitosApi.remove(deleting.id);
      toast.success('Hábito eliminado');
      setDeleting(null);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Hábitos" subtitle="Gestiona tus rituales" />
      <PageContainer>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar hábito…"
              className="w-full bg-ink-900/60 border border-white/10 rounded-xl pl-10 pr-4 h-11 text-sm text-ink-100 placeholder:text-ink-400 focus:border-ember-500/60 focus:shadow-glow ring-focus transition-all"
            />
          </div>
          <div className="glass rounded-xl p-1 flex gap-1">
            {(['all', 'active', 'inactive'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 h-9 text-xs font-medium rounded-lg transition-colors ring-focus ${
                  filter === f
                    ? 'bg-gradient-to-br from-ember-500/30 to-ember-700/10 text-ember-200 border border-ember-500/40'
                    : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
              </button>
            ))}
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4" />
            Nuevo hábito
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title={data?.length ? 'Sin resultados' : 'Sin hábitos todavía'}
            description={data?.length ? 'Ajusta la búsqueda o el filtro.' : 'Crea tu primer hábito para empezar.'}
            action={
              !data?.length && (
                <Button onClick={() => setCreating(true)}>
                  <Plus className="w-4 h-4" />
                  Crear primer hábito
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((h, i) => (
                <HabitCard
                  key={h.id}
                  habito={h}
                  index={i}
                  onEdit={(x) => setEditing(x)}
                  onDelete={(x) => setDeleting(x)}
                  onToggleActive={handleToggle}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nuevo hábito"
        description="Define un ritual para construir tu rutina."
      >
        <HabitForm
          idUsuario={currentUser.id}
          loading={saving}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar hábito"
        description="Actualiza la información del hábito."
      >
        <HabitForm
          initial={editing}
          idUsuario={currentUser.id}
          loading={saving}
          onCancel={() => setEditing(null)}
          onSubmit={handleUpdate}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar hábito"
        description={`¿Seguro que quieres eliminar "${deleting?.nombre}"? Esta acción no se puede deshacer.`}
        loading={saving}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
