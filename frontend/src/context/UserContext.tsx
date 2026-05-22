import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { usersApi } from '@/api/users';

interface UserContextValue {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = 'habit-tracker:current-user-id';

const DEFAULT_USER_EMAIL = 'jtobar@unimayor.edu.co';
const DEFAULT_USER_NAME_HINT = 'jonathan tobar';

function pickDefaultUser(list: User[]): User | null {
  const byEmail = list.find(
    (u) => u.email.toLowerCase() === DEFAULT_USER_EMAIL,
  );
  if (byEmail) return byEmail;

  const byName = list.find((u) =>
    u.name.toLowerCase().includes(DEFAULT_USER_NAME_HINT),
  );
  if (byName) return byName;

  return list[0] ?? null;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await usersApi.list();
      setUsers(list);

      const storedRaw = localStorage.getItem(STORAGE_KEY);
      const storedId = storedRaw !== null ? Number(storedRaw) : null;
      const stored =
        storedId !== null ? list.find((u) => u.id === storedId) : undefined;

      // Si no hay elección previa guardada, intentamos el perfil por defecto
      // (Jonathan Tobar). Si tampoco está, caemos al primero de la lista.
      const initial = stored ?? pickDefaultUser(list);
      setCurrentUserState(initial);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    if (user) localStorage.setItem(STORAGE_KEY, String(user.id));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ users, currentUser, loading, error, setCurrentUser, refresh: load }),
    [users, currentUser, loading, error, setCurrentUser, load],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUsers must be used within UserProvider');
  return ctx;
}
