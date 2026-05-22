import { api } from './client';
import type { User } from '@/types';

export type UserPayload = Pick<User, 'name' | 'email'>;

export const usersApi = {
  list:        ()                            => api.get<User[]>('/users'),
  getById:     (id: number)                  => api.get<User>(`/users/${id}`),
  getByEmail:  (email: string)               => api.get<User>(`/users/by-email/${encodeURIComponent(email)}`),
  create:      (payload: UserPayload)        => api.post<User>('/users', payload),
  update:      (id: number, payload: UserPayload) => api.put<User>(`/users/${id}`, { id, ...payload }),
  remove:      (id: number)                  => api.delete<void>(`/users/${id}`),
};
