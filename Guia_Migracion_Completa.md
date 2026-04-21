# Guía Completa de Migración - Habit Tracker API (NumerosAPI)

## 1. Visión General del Proyecto
Este es un proyecto **.NET 10** (preview) de una **API REST** para un rastreador de hábitos (Habit Tracker). Implementa CRUD completo para:
- **Usuarios** (autenticación básica sin hash de passwords en código actual)
- **Hábitos** (asociados a usuarios, con estado activo/inactivo)
- **Registros de Hábitos** (log diario de cumplimiento)
- **Estadísticas de Hábitos** (días cumplidos, racha, % cumplimiento)

**Arquitectura**:
- **Patrón Repository** con **Dapper** (micro-ORM) sobre **SQLite**.
- **Inyección de Dependencias** nativa de ASP.NET Core.
- **Documentación automática**: OpenAPI + Scalar UI (UI interactiva en `/scalar`).
- **Manejo especial**: `DateOnly` con custom JsonConverter y Dapper TypeHandler.

**Directorio raíz**: `c:/Users/SDB/Desktop/app_habitos/HABIT_TRACKER`
```
HABIT_TRACKER/
├── Guía de Migración De CRUD Básico.md (guía previa básica)
├── Numeros2.sln                          (solución Visual Studio)
├── Data/
│   └── DataBase.db3                      (DB SQLite - NO incluir en repo; regenerar)
├── NumerosAPI/                           (API Web - .NET 10 Web SDK)
│   ├── Controllers/                      (4 controllers CRUD)
│   │   ├── UsuariosControllers.cs
│   │   ├── HabitosControllers.cs
│   │   ├── RegistrosHabitosControllers.cs
│   │   └── EstadisticasHabitoControllers.cs
│   ├── Properties/launchSettings.json
│   ├── appsettings.json                  (DB conn: ../Data/DataBase.db3)
│   ├── appsettings.Development.json
│   ├── Program.cs                        (DI, pipeline)
│   ├── NumerosAPI.csproj
│   ├── bin/ (generados)
│   └── obj/ (generados)
└── Repository/                           (Librería de modelos/repos)
    ├── Infrastructure/
    │   ├── DapperHelper.cs               (DB helper Dapper+Sqlite)
    │   └── DateOnlyTypeHandler.cs
    ├── Interfaces/                       (I*Repository)
    ├── Modelos/                          (POCOs)
    │   ├── Usuario.cs
    │   ├── Habito.cs
    │   ├── RegistroHabito.cs
    │   └── EstadisticaHabito.cs
    ├── Repositories/
    │   ├── UsuarioRepository.cs
    │   ├── HabitoRepository.cs
    │   ├── RegistroHabitoRepository.cs
    │   └── EstadisticaHabitoRepository.cs
    ├── DateOnlyJsonConverter.cs
    └── Repository.csproj
```

## 2. Dependencias (.NET 10 Preview - verificar compatibilidad)
### NumerosAPI.csproj
```
Microsoft.AspNetCore.OpenApi 10.0.1
Scalar.AspNetCore 2.12.52
Repository.csproj (ref)
```

### Repository.csproj
```
Dapper 2.1.66
Microsoft.Data.Sqlite 10.0.3
Microsoft.Extensions.Configuration.Abstractions 10.0.3
```

**Restore**: `dotnet restore Numeros2.sln`

## 3. Base de Datos (SQLite: Data/DataBase.db3)
**Ubicación relativa**: Desde API → `../Data/DataBase.db3`

**Esquema inferido de repos/SQL** (regenerar con scripts abajo):
```sql
-- usuarios
CREATE TABLE usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  email TEXT UNIQUE,
  password TEXT,
  fecha_registro DATETIME
);

-- habitos
CREATE TABLE habitos (
  id_habito INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER,
  nombre TEXT,
  descripcion TEXT,
  fecha_creacion DATE,
  activo INTEGER DEFAULT 1,
  FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
);

-- registros_habitos (inferido)
CREATE TABLE registros_habitos (
  id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
  id_habito INTEGER,
  fecha DATE,
  cumplido INTEGER DEFAULT 0,
  FOREIGN KEY(id_habito) REFERENCES habitos(id_habito)
);

-- estadisticas_habitos (calculadas? o tabla)
CREATE TABLE estadisticas_habitos (
  id_estadistica INTEGER PRIMARY KEY AUTOINCREMENT,
  id_habito INTEGER,
  dias_cumplidos INTEGER,
  racha_actual INTEGER,
  porcentaje_c REAL,
  FOREIGN KEY(id_habito) REFERENCES habitos(id_habito)
);
```

**Migración DB**:
1. Copiar `DataBase.db3` o regenerar:
```bash
# En Data/
sqlite3 DataBase.db3 < schema.sql  # Crear schema.sql con arriba
sqlite3 DataBase.db3 "INSERT INTO usuarios ...;"  # Datos sample
```
2. Actualizar ruta en `appsettings.json` si cambia.

## 4. Configuración (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=../Data/DataBase.db3"
  },
  "Logging": { ... },
  "AllowedHosts": "*"
}
```

## 5. API Endpoints (CRUD completo, /api/[controller])
| Controller | Métodos |
|------------|---------|
| **Usuarios** (`/api/usuarios`) | GET all, GET/{id}, GET/buscar?email=, GET/existe?email=, POST, PUT/{id}, DELETE/{id} |
| **Habitos** (`/api/habitos`) | GET all, GET/{id}, GET/usuario/{id_usuario}, GET/usuario/{id}/activos?activo=1, POST, PUT/{id}, DELETE/{id} |
| **RegistrosHabitos** | Similar CRUD (ver código) |
| **EstadisticasHabito** | Similar CRUD (ver código) |

**Ejemplos**:
- `POST /api/usuarios`: `{ "nombre": "Juan", "email": "juan@example.com", "password": "pass", "fecha_registro": "2024-01-01" }`
- Docs auto: `https://localhost:5xxx/scalar` (Scalar UI)

## 6. Código Clave
- **Program.cs**: Registra DI (`AddScoped<I*Repository, *Repository>()`), OpenAPI, Scalar.
- **DapperHelper**: Maneja conn SQLite + queries (`QueryAsync<T>`, `ExecuteAsync`).
- **Repos**: SQL raw hardcoded (e.g., `SELECT * FROM habitos WHERE ...`).
- **Models**: POCO simples con `DateOnly`/`DateTime`.

## 7. Pasos para Migrar/Replicar
1. **Clonar/Copiar estructura** (excluir bin/obj/DataBase.db3 en .gitignore).
2. `dotnet restore Numeros2.sln`
3. **Crear DB**: Usar schema arriba en `Data/DataBase.db3`.
4. `dotnet build`
5. **Run**: `cd NumerosAPI && dotnet run` → `https://localhost:5xxx/swagger` o `/scalar`.
6. **Test**: Postman/Thunder o Scalar UI.
7. **Migrar a prod**: Cambiar SQLite → PostgreSQL/MySQL (update DapperHelper a Npgsql, etc.), deploy Azure/AWS (dockerize?).

## 8. Notas/Mejoras Pendientes
- **Seguridad**: Hash passwords (BCrypt), JWT auth.
- **Validación**: [FromBody] sin `[ValidateModel]`.
- **EF Core?**: Actual migrar Dapper → EF para migrations auto.
- **Tests**: Agregar xUnit.
- **Docker**: Dockerfile simple.

**¡Proyecto listo para migración! Contactar para dudas.**

