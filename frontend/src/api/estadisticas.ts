import { api } from './client';
import type { EstadisticaHabito } from '@/types';

export interface EstadisticaPayload {
  idHabito: number;
  diasCumplidos: number;
  rachaActual: number;
  porcentaje: number;
}

export const estadisticasApi = {
  list:    ()                                       => api.get<EstadisticaHabito[]>('/estadisticas-habitos'),
  getById: (id: number)                             => api.get<EstadisticaHabito>(`/estadisticas-habitos/${id}`),
  byHabito:(idHabito: number)                       => api.get<EstadisticaHabito[]>(`/estadisticas-habitos/habito/${idHabito}`),
  create:  (payload: EstadisticaPayload)            => api.post<EstadisticaHabito>('/estadisticas-habitos', payload),
  update:  (id: number, payload: EstadisticaPayload) =>
    api.put<EstadisticaHabito>(`/estadisticas-habitos/${id}`, { id, ...payload }),
  remove:  (id: number)                             => api.delete<void>(`/estadisticas-habitos/${id}`),
};
