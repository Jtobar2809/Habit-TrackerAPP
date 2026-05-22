// Espejo de los modelos del backend (HabitTrackerApp.Core/Modules/*/Domain).

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Habito {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  idUsuario: number;
  fechaCreacion: string;
  user?: User | null;
}

export interface RegistroHabito {
  id: number;
  idHabito: number;
  fecha: string;
  cumplido: boolean;
  habito?: Habito | null;
}

export interface EstadisticaHabito {
  id: number;
  idHabito: number;
  diasCumplidos: number;
  rachaActual: number;
  porcentaje: number;
  habito?: Habito | null;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
