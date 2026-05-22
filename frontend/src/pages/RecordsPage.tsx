import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, CalendarCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RecordRow } from '@/components/features/RecordRow';
import { RecordForm } from '@/components/features/RecordForm';
import { useUsers } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { registrosApi, type RegistroPayload } from '@/api/registros';
import { habitosApi } from '@/api/habitos';
import type { RegistroHabito } from '@/types';

export function RecordsPage() {
  const { currentUser } = useUsers();
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<RegistroHabito | null>(null);
  const [saving, setSaving] = useState(false);

  const habitos = useAsync(
    () => (currentUser ? habitosApi.byUser(currentUser.id) : Promise.resolve([])),
    [currentUser?.id],
  );

  const registros = useAsync(() => registrosApi.list(), []);

  const userHabitIds = useMemo(
    () => new Set((habitos.data ?? []).map((h) => h.id)),
    [habitos.data],
  );

  const userRecords = useMemo(() => {
    return (registros.data ?? [])
      .filter((r) => userHabitIds.has(r.idHabito))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [registros.data, userHabitIds]);

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Registros" />
        <PageContainer>
          <EmptyState icon={CalendarCheck} title="Selecciona un usuario" description="Necesitas un usuario activo." />
        </PageContainer>
      </div>
    );
  }

  const refetch = async () => {
    await registros.refetch();
  };

  const handleCreate = async (payload: RegistroPayload) => {
    setSaving(true);
    try {
      await registrosApi.create(payload);
      toast.success('Registro creado');
      setCreating(false);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (r: RegistroHabito) => {
    try {
      await registrosApi.update(r.id, {
        idHabito: r.idHabito,
        fecha: r.fecha,
        cumplido: !r.cumplido,
      });
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await registrosApi.remove(deleting.id);
      toast.success('Registro eliminado');
      setDeleting(null);
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const loading = habitos.loading || registros.loading;

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Registros" subtitle="Marca tus avances diarios" />
      <PageContainer>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-50">Historial</h2>
            <p className="text-xs text-ink-400 mt-0.5">
              {userRecords.length} {userRecords.length === 1 ? 'registro' : 'registros'} de tus hábitos
            </p>
          </div>
          <Button onClick={() => setCreating(true)} disabled={(habitos.data ?? []).length === 0}>
            <Plus className="w-4 h-4" />
            Nuevo registro
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (habitos.data ?? []).length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Crea un hábito primero"
            description="Necesitas tener al menos un hábito para poder registrarlo."
          />
        ) : userRecords.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Sin registros"
            description="Marca tu primera victoria del día."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                Primer registro
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {userRecords.map((r, i) => {
                const hb = (habitos.data ?? []).find((h) => h.id === r.idHabito);
                return (
                  <RecordRow
                    key={r.id}
                    registro={r}
                    habitName={hb?.nombre}
                    index={i}
                    onToggle={handleToggle}
                    onDelete={setDeleting}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nuevo registro" description="Marca el cumplimiento de un hábito.">
        <RecordForm
          habitos={habitos.data ?? []}
          loading={saving}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar registro"
        description="Esta acción no se puede deshacer."
        loading={saving}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
