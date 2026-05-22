import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, type RouteKey } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from '@/context/ToastContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { RecordsPage } from '@/pages/RecordsPage';
import { StatsPage } from '@/pages/StatsPage';
import { UsersPage } from '@/pages/UsersPage';

export default function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <Shell />
      </UserProvider>
    </ToastProvider>
  );
}

function Shell() {
  const [route, setRoute] = useState<RouteKey>('dashboard');

  return (
    <div className="min-h-screen flex">
      <Sidebar current={route} onChange={setRoute} />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {route === 'dashboard' && <DashboardPage />}
            {route === 'habits' && <HabitsPage />}
            {route === 'records' && <RecordsPage />}
            {route === 'stats' && <StatsPage />}
            {route === 'users' && <UsersPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav current={route} onChange={setRoute} />
    </div>
  );
}
