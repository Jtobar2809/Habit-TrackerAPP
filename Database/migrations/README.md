# Migraciones de Base de Datos

Scripts SQL para crear y poblar la base de datos SQLite del backend.

La cadena de conexión por defecto del backend apunta a:

```
HabitTrackerApp.Core/Data/todo.db
```

## Archivos

| Archivo            | Descripción                                                                |
|--------------------|----------------------------------------------------------------------------|
| `001_init.sql`     | Crea las tablas `Users`, `Habitos`, `RegistrosHabitos`, `EstadisticasHabitos` con índices y FKs. |
| `002_seed.sql`     | Datos de ejemplo opcionales (2 usuarios, 5 hábitos, registros).            |

## Cómo aplicar las migraciones

### Opción A — Con `sqlite3` CLI
Desde la raíz del repo:

```powershell
sqlite3 HabitTrackerApp.Core\Data\todo.db ".read Database/migrations/001_init.sql"
sqlite3 HabitTrackerApp.Core\Data\todo.db ".read Database/migrations/002_seed.sql"   # opcional
```

### Opción B — Con DB Browser for SQLite
1. Abre `HabitTrackerApp.Core\Data\todo.db`.
2. Pestaña **Execute SQL**.
3. Pega el contenido de `001_init.sql` y ejecuta.
4. (Opcional) Repite con `002_seed.sql`.
5. **Write Changes**.

### Opción C — Si quieres una DB fresca
Borra `HabitTrackerApp.Core\Data\todo.db` y vuelve a aplicar el script `001_init.sql`.

> Las sentencias usan `CREATE TABLE IF NOT EXISTS`, por lo que son idempotentes.
