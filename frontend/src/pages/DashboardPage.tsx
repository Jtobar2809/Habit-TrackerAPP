import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, ListChecks, Target, TrendingUp, Calendar } from 'lucide-react';
import { useUsers } from '@/context/UserContext';
import { useAsync } from '@/hooks/useAsync';
import { habitosApi } from '@/api/habitos';
import { registrosApi } from '@/api/registros';
import { estadisticasApi } from '@/api/estadisticas';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function DashboardPage() {
  const { currentUser, loading: usersLoading } = useUsers();

  const habitos = useAsync(
    () => (currentUser ? habitosApi.byUser(currentUser.id) : Promise.resolve([])),
    [currentUser?.id],
  );
  const registros = useAsync(() => registrosApi.list(), []);
  const estadisticas = useAsync(() => estadisticasApi.list(), []);

  const activeCount = useMemo(
    () => (habitos.data ?? []).filter((h) => h.activo).length,
    [habitos.data],
  );

  const userHabitIds = useMemo(
    () => new Set((habitos.data ?? []).map((h) => h.id)),
    [habitos.data],
  );

  const userRecords = useMemo(
    () => (registros.data ?? []).filter((r) => userHabitIds.has(r.idHabito)),
    [registros.data, userHabitIds],
  );

  const completedThisWeek = useMemo(() => {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return userRecords.filter((r) => {
      const t = new Date(r.fecha).getTime();
      return r.cumplido && now - t <= oneWeek;
    }).length;
  }, [userRecords]);

  const bestStreak = useMemo(() => {
    const userStats = (estadisticas.data ?? []).filter((s) => userHabitIds.has(s.idHabito));
    return userStats.reduce((max, s) => Math.max(max, s.rachaActual), 0);
  }, [estadisticas.data, userHabitIds]);

  const avgCompletion = useMemo(() => {
    const userStats = (estadisticas.data ?? []).filter((s) => userHabitIds.has(s.idHabito));
    if (!userStats.length) return 0;
    return userStats.reduce((sum, s) => sum + s.porcentaje, 0) / userStats.length;
  }, [estadisticas.data, userHabitIds]);

  if (usersLoading) return <DashboardSkeleton />;

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Bienvenido" subtitle="Selecciona un usuario" />
        <PageContainer>
          <EmptyState
            icon={Flame}
            title="Crea o selecciona un usuario"
            description="Ve a la sección Usuarios para empezar."
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Hola, ${firstName(currentUser.name)} 🔥`} subtitle="Tu progreso, en tiempo real" />
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard label="Hábitos activos" value={activeCount} icon={ListChecks} accent="ember" hint={`${(habitos.data ?? []).length} en total`} delay={0} />
          <StatCard label="Cumplidos (7d)" value={completedThisWeek} icon={Target} accent="emerald" delay={0.06} />
          <StatCard label="Mejor racha" value={bestStreak} icon={Flame} accent="amber" hint="días consecutivos" delay={0.12} />
          <StatCard label="Cumplimiento" value={`${avgCompletion.toFixed(0)}%`} icon={TrendingUp} accent="sky" hint="promedio" delay={0.18} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-50">Hábitos activos</h2>
                <p className="text-xs text-ink-400 mt-0.5">Tus rituales en curso</p>
              </div>
              <Badge variant="ember">{activeCount}</Badge>
            </div>

            {habitos.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : activeCount === 0 ? (
              <EmptyState
                icon={ListChecks}
                title="Sin hábitos activos"
                description="Crea tu primer hábito en la sección Hábitos."
              />
            ) : (
              <div className="space-y-2">
                {(habitos.data ?? [])
                  .filter((h) => h.activo)
                  .slice(0, 6)
                  .map((h, i) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-ink-900/30 border border-white/5 hover:border-ember-500/30 transition-all"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-ember-500/20 to-ember-700/5 border border-ember-500/30">
                        <Flame className="w-4 h-4 text-ember-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-ink-100 truncate">{h.nombre}</div>
                        <div className="text-xs text-ink-400 truncate">{h.descripcion || 'Sin descripción'}</div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-50">Últimos registros</h2>
                <p className="text-xs text-ink-400 mt-0.5">Tus marcas recientes</p>
              </div>
              <Calendar className="w-4 h-4 text-ink-400" />
            </div>

            {registros.loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : userRecords.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Sin registros"
                description="Empieza a registrar tus hábitos diarios."
              />
            ) : (
              <div className="space-y-2">
                {userRecords
                  .slice()
                  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                  .slice(0, 5)
                  .map((r, i) => {
                    const hb = (habitos.data ?? []).find((h) => h.id === r.idHabito);
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-ink-900/30 border border-white/5"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            r.cumplido ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' : 'bg-ember-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-ink-100 truncate">{hb?.nombre ?? `#${r.idHabito}`}</div>
                          <div className="text-[11px] text-ink-400">
                            {new Date(r.fecha).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}

function firstName(name: string) {
  return name.split(' ')[0];
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 lg:px-10 pt-6 lg:pt-8 pb-4">
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-10 w-72" />
      </div>
      <PageContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
