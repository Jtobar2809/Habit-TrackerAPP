import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Users as UsersIcon, Pencil, Trash2, Mail, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { UserForm } from '@/components/features/UserForm';
import { useUsers } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { usersApi, type UserPayload } from '@/api/users';
import type { User } from '@/types';

export function UsersPage() {
  const { users, currentUser, setCurrentUser, refresh, loading } = useUsers();
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = async (payload: UserPayload) => {
    setSaving(true);
    try {
      const created = await usersApi.create(payload);
      toast.success('Usuario creado');
      setCreating(false);
      await refresh();
      setCurrentUser(created);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload: UserPayload) => {
    if (!editing) return;
    setSaving(true);
    try {
      await usersApi.update(editing.id, payload);
      toast.success('Usuario actualizado');
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await usersApi.remove(deleting.id);
      toast.success('Usuario eliminado');
      if (currentUser?.id === deleting.id) setCurrentUser(null);
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Usuarios" subtitle="Quién usa Ember" />
      <PageContainer>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-50">Cuentas</h2>
            <p className="text-xs text-ink-400 mt-0.5">{users.length} en total</p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4" />
            Nuevo usuario
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="Sin usuarios"
            description="Crea tu primer usuario para empezar."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                Crear usuario
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {users.map((u, i) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <motion.article
                    layout
                    key={u.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    whileHover={{ y: -3 }}
                    className={`glass rounded-2xl p-5 transition-all hover:shadow-glow ${
                      isCurrent ? 'border-ember-500/50 shadow-glow' : 'hover:border-ember-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500 to-ember-700 flex items-center justify-center text-white font-semibold shadow-glow">
                        {initials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-ink-50 truncate">{u.name}</div>
                        <div className="flex items-center gap-1 text-xs text-ink-400 mt-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      </div>
                      {isCurrent && <Badge variant="ember">Activo</Badge>}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-ink-400 mb-4">
                      <Calendar className="w-3 h-3" />
                      Registrado · {new Date(u.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      {!isCurrent && (
                        <Button size="sm" variant="outline" onClick={() => setCurrentUser(u)}>
                          Activar
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => setEditing(u)}>
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleting(u)} className="ml-auto">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </PageContainer>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nuevo usuario">
        <UserForm loading={saving} onCancel={() => setCreating(false)} onSubmit={handleCreate} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar usuario">
        <UserForm initial={editing} loading={saving} onCancel={() => setEditing(null)} onSubmit={handleUpdate} />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar usuario"
        description={`¿Eliminar a "${deleting?.name}"? Sus hábitos asociados se borrarán en cascada.`}
        loading={saving}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
