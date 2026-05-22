import { api } from './client';
import type { RegistroHabito } from '@/types';

export interface RegistroPayload {
  idHabito: number;
  fecha: string; // ISO yyyy-MM-ddTHH:mm:ss
  cumplido: boolean;
}

export const registrosApi = {
  list:    ()                                     => api.get<RegistroHabito[]>('/registros-habitos'),
  getById: (id: number)                           => api.get<RegistroHabito>(`/registros-habitos/${id}`),
  byHabito:(idHabito: number)                     => api.get<RegistroHabito[]>(`/registros-habitos/habito/${idHabito}`),
  create:  (payload: RegistroPayload)             => api.post<RegistroHabito>('/registros-habitos', payload),
  update:  (id: number, payload: RegistroPayload) =>
    api.put<RegistroHabito>(`/registros-habitos/${id}`, { id, ...payload }),
  remove:  (id: number)                           => api.delete<void>(`/registros-habitos/${id}`),
};
