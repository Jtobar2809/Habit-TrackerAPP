# Ember · Habit Tracker Frontend

Frontend moderno construido con **React 18 + Vite + TypeScript + TailwindCSS + Framer Motion**.
Consume la API existente del backend `.NET 10` sin modificarla — Vite proxy reenvía las llamadas a `http://localhost:5000`.

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite 5** (dev server + build)
- **TailwindCSS 3** con paleta personalizada `ember` (rojos modernos)
- **Framer Motion** (animaciones, transiciones de página, layout animations)
- **Lucide React** (iconografía)
- Hooks propios para data fetching (`useAsync`)
- Context para usuario activo y toasts

## Estructura

```
frontend/
├── src/
│   ├── api/              # Clientes HTTP por recurso (users, habitos, registros, estadisticas)
│   ├── components/
│   │   ├── ui/           # Button, Card, Modal, Input, Badge, Skeleton, ConfirmDialog, StatCard, EmptyState
│   │   ├── layout/       # Sidebar, MobileNav, Header, PageContainer
│   │   └── features/     # HabitCard, HabitForm, RecordRow, RecordForm, StatsCard, StatsForm, UserForm
│   ├── context/          # UserContext, ToastContext
│   ├── hooks/            # useAsync
│   ├── lib/              # cn (clsx + tailwind-merge)
│   ├── pages/            # Dashboard, Habits, Records, Stats, Users
│   ├── types/            # Tipos espejo de los modelos del backend
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── flame.svg         # Favicon
├── index.html
├── vite.config.ts        # Proxy hacia el backend en :5000
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Instalación y ejecución

```powershell
cd frontend
npm install
npm run dev
```

El frontend abre en `http://localhost:5173`. Asegúrate de tener el backend levantado en `http://localhost:5000` (`dotnet run --project HabitTrackerApp.Api`).

## Build de producción

```powershell
npm run build
npm run preview
```

## Características

- **Tema dark** con acentos en rojos `ember-*` (paleta personalizada).
- **Sidebar** con animación `layoutId` para indicar la sección activa.
- **Bottom nav** en mobile con la misma animación compartida.
- **Modales** con backdrop blur + animaciones de entrada/salida.
- **Toasts** apilables con auto-dismiss (4s).
- **Skeletons** con shimmer mientras carga.
- **Cards** con hover lift + glow.
- **Stats** con barra de progreso animada.
- **Layout animations** (`AnimatePresence` + `layout`) al añadir/eliminar items.
- **Persistencia** del usuario activo en `localStorage`.

## Reglas

- ⚠️ El backend **no se modifica**. La integración usa Vite proxy.
- Todos los componentes están separados por responsabilidad: UI base / layout / features.
- Tipos espejo del backend en `src/types/index.ts`.
