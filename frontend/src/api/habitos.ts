import { api } from './client';
import type { Habito } from '@/types';

export interface HabitoPayload {
  nombre: string;
  descripcion: string;
  activo: boolean;
  idUsuario: number;
}

export const habitosApi = {
  list:         ()                         => api.get<Habito[]>('/habitos'),
  getById:      (id: number)               => api.get<Habito>(`/habitos/${id}`),
  byUser:       (idUsuario: number)        => api.get<Habito[]>(`/habitos/usuario/${idUsuario}`),
  activeByUser: (idUsuario: number)        => api.get<Habito[]>(`/habitos/usuario/${idUsuario}/activos`),
  create:       (payload: HabitoPayload)   => api.post<Habito>('/habitos', payload),
  update:       (id: number, payload: HabitoPayload) =>
    api.put<Habito>(`/habitos/${id}`, { id, ...payload }),
  remove:       (id: number)               => api.delete<void>(`/habitos/${id}`),
};
