import type { RegistroHabito } from '@/types';

export interface ComputedStats {
  diasCumplidos: number;
  rachaActual: number;
  porcentaje: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDayStart(value: string): number | null {
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Calcula estadísticas para un hábito a partir de sus registros:
 *  - diasCumplidos : total de registros con cumplido=true.
 *  - rachaActual   : días consecutivos cumplidos terminando en el registro más reciente.
 *                    Si el registro más reciente no está cumplido, la racha es 0.
 *                    Saltos de día (gaps) rompen la racha.
 *  - porcentaje    : diasCumplidos / totalRegistros * 100 (redondeado a 1 decimal).
 */
export function computeStatsForHabit(registros: RegistroHabito[]): ComputedStats {
  if (registros.length === 0) {
    return { diasCumplidos: 0, rachaActual: 0, porcentaje: 0 };
  }

  const diasCumplidos = registros.reduce((acc, r) => acc + (r.cumplido ? 1 : 0), 0);
  const porcentaje = Math.round((diasCumplidos / registros.length) * 1000) / 10;

  // Ordenar por día descendente, agrupando por día (toma el último estado del día).
  const byDay = new Map<number, boolean>();
  for (const r of registros) {
    const day = toDayStart(r.fecha);
    if (day === null) continue;
    // Si ya hay un valor para ese día, prevalece el "cumplido" (true gana sobre false).
    byDay.set(day, (byDay.get(day) ?? false) || r.cumplido);
  }

  const days = Array.from(byDay.keys()).sort((a, b) => b - a);

  let racha = 0;
  let expected = days[0];
  for (const day of days) {
    if (day !== expected) break;            // hueco de días
    if (!byDay.get(day)) break;             // día no cumplido
    racha += 1;
    expected = day - MS_PER_DAY;
  }

  return { diasCumplidos, rachaActual: racha, porcentaje };
}

/**
 * Compara dos cálculos para decidir si vale la pena hacer un PUT.
 * (Evita llamadas innecesarias al backend si nada cambió.)
 */
export function statsEqual(a: ComputedStats, b: ComputedStats): boolean {
  return (
    a.diasCumplidos === b.diasCumplidos &&
    a.rachaActual === b.rachaActual &&
    Math.abs(a.porcentaje - b.porcentaje) < 0.05
  );
}
