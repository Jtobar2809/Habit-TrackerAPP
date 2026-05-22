import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, RefreshCw, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StatsCard } from '@/components/features/StatsCard';
import { useUsers } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { useAsync } from '@/hooks/useAsync';
import { estadisticasApi } from '@/api/estadisticas';
import { habitosApi } from '@/api/habitos';
import { registrosApi } from '@/api/registros';
import { computeStatsForHabit, statsEqual } from '@/lib/calcStats';
import type { EstadisticaHabito } from '@/types';

export function StatsPage() {
  const { currentUser } = useUsers();
  const toast = useToast();

  const [deleting, setDeleting] = useState<EstadisticaHabito | null>(null);
  const [savingDelete, setSavingDelete] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  const habitos = useAsync(
    () => (currentUser ? habitosApi.byUser(currentUser.id) : Promise.resolve([])),
    [currentUser?.id],
  );
  const registros = useAsync(() => registrosApi.list(), []);
  const estadisticas = useAsync(() => estadisticasApi.list(), []);

  const userHabitIds = useMemo(
    () => new Set((habitos.data ?? []).map((h) => h.id)),
    [habitos.data],
  );

  const userStats = useMemo(
    () => (estadisticas.data ?? []).filter((s) => userHabitIds.has(s.idHabito)),
    [estadisticas.data, userHabitIds],
  );

  const dataReady =
    !habitos.loading && !registros.loading && !estadisticas.loading && !!currentUser;

  /**
   * Calcula stats por hábito y las sincroniza con el backend:
   *  - PUT si ya existe una estadística para ese hábito.
   *  - POST si no existe.
   *  - Skip si los valores no cambiaron (evita ruido en la red).
   */
  const syncStats = async (silent = false) => {
    if (!currentUser || syncing) return;
    const habits = habitos.data ?? [];
    const allRegs = registros.data ?? [];
    if (habits.length === 0) return;

    // Mapa idHabito -> estadística existente (la primera si hay duplicados).
    const existing = new Map<number, EstadisticaHabito>();
    for (const s of estadisticas.data ?? []) {
      if (!existing.has(s.idHabito)) existing.set(s.idHabito, s);
    }

    setSyncing(true);
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    try {
      for (const habit of habits) {
        const regs = allRegs.filter((r) => r.idHabito === habit.id);
        const computed = computeStatsForHabit(regs);
        const payload = { idHabito: habit.id, ...computed };

        try {
          const prev = existing.get(habit.id);
          if (prev) {
            if (statsEqual(computed, prev)) {
              skipped += 1;
              continue;
            }
            await estadisticasApi.update(prev.id, payload);
            updated += 1;
          } else {
            await estadisticasApi.create(payload);
            created += 1;
          }
        } catch {
          errors += 1;
        }
      }

      await estadisticas.refetch();
      setLastSyncAt(new Date());

      if (!silent) {
        if (errors > 0) {
          toast.error(`Sincronizado con ${errors} error${errors === 1 ? '' : 'es'}.`);
        } else if (created + updated === 0) {
          toast.info('Estadísticas ya estaban al día.');
        } else {
          toast.success(
            `Estadísticas sincronizadas · ${created} nueva${created === 1 ? '' : 's'} · ${updated} actualizada${updated === 1 ? '' : 's'}${
              skipped > 0 ? ` · ${skipped} sin cambios` : ''
            }.`,
          );
        }
      }
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync: se dispara una vez por usuario cuando los tres recursos están listos.
  const syncedForUserRef = useRef<number | null>(null);
  useEffect(() => {
    if (!dataReady) return;
    if (!currentUser) return;
    if (syncedForUserRef.current === currentUser.id) return;
    syncedForUserRef.current = currentUser.id;
    void syncStats(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady, currentUser?.id]);

  const handleDelete = async () => {
    if (!deleting) return;
    setSavingDelete(true);
    try {
      await estadisticasApi.remove(deleting.id);
      toast.success('Estadística eliminada');
      setDeleting(null);
      await estadisticas.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setSavingDelete(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Estadísticas" />
        <PageContainer>
          <EmptyState
            icon={BarChart3}
            title="Selecciona un usuario"
            description="Necesitas un usuario activo."
          />
        </PageContainer>
      </div>
    );
  }

  const loading = habitos.loading || registros.loading || estadisticas.loading;
  const noHabits = (habitos.data ?? []).length === 0;

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Estadísticas" subtitle="Calculadas en automático" />
      <PageContainer>
        <AutoBanner
          syncing={syncing}
          lastSyncAt={lastSyncAt}
          onRecalc={() => syncStats(false)}
        />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-50">Indicadores</h2>
            <p className="text-xs text-ink-400 mt-0.5">
              {userStats.length} hábito{userStats.length === 1 ? '' : 's'} con estadística
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => syncStats(false)}
            loading={syncing}
            disabled={loading || noHabits}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Recalcular
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : noHabits ? (
          <EmptyState
            icon={BarChart3}
            title="Sin hábitos"
            description="Crea un hábito y empieza a registrarlo. Sus estadísticas se calcularán solas."
          />
        ) : userStats.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Calculando…"
            description="En un momento aparecerán tus métricas. Si no, pulsa Recalcular."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {userStats.map((s, i) => {
                const hb = (habitos.data ?? []).find((h) => h.id === s.idHabito);
                return (
                  <StatsCard
                    key={s.id}
                    stat={s}
                    habitName={hb?.nombre}
                    index={i}
                    onDelete={setDeleting}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar estadística"
        description="Se eliminará del backend. Volverá a generarse en la próxima sincronización."
        loading={savingDelete}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function AutoBanner({
  syncing,
  lastSyncAt,
  onRecalc,
}: {
  syncing: boolean;
  lastSyncAt: Date | null;
  onRecalc: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 mb-5 flex items-center gap-3 border-ember-500/30"
    >
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-ember-500/30 blur-lg rounded-xl" />
        <div className="relative p-2 rounded-xl bg-gradient-to-br from-ember-500/30 to-ember-700/10 border border-ember-500/40">
          {syncing ? (
            <RefreshCw className="w-4 h-4 text-ember-300 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-ember-300" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink-100">
          {syncing ? 'Sincronizando estadísticas…' : 'Cálculo automático activo'}
        </div>
        <div className="text-xs text-ink-400 mt-0.5">
          Se generan a partir de tus registros · días cumplidos, racha y porcentaje.
          {lastSyncAt && !syncing && (
            <> Última sync: {lastSyncAt.toLocaleTimeString()}.</>
          )}
        </div>
      </div>
      <button
        onClick={onRecalc}
        disabled={syncing}
        className="hidden sm:inline-flex text-xs font-medium text-ember-300 hover:text-ember-200 disabled:opacity-50 transition-colors ring-focus rounded-md px-2 py-1"
      >
        Recalcular
      </button>
    </motion.div>
  );
}
