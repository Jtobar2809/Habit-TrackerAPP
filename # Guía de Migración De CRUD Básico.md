# Guía de Migración: De CRUD Básico a Monolito Modular con Clean Architecture + Minimal API

---

## 🎯 Objetivo

Transformar una aplicación CRUD básica en una arquitectura modular, mantenible y escalable, aplicando:

- Clean Architecture
- Patrón Repositorio
- Casos de uso (Use Cases)
- Separación por capas
- Exposición mediante Minimal API

---

## 🧠 Enfoque del curso

En este curso utilizamos un **monolito modular**, porque:

- Reduce complejidad
- Permite aplicar buenas prácticas reales
- Evita sobreingeniería (microservicios)

> Clean Architecture define capas conceptuales, no proyectos físicos.

---

## 🏗️ Arquitectura objetivo

```plaintext
API (Minimal API)
   ↓
Application (Use Cases)
   ↓
Domain (Entidades)
   ↑
Infrastructure (Base de datos)

📁 Estructura de la solución
Solution
│
├── Core (Class Library)
│   ├── Modules/
│   │   └── People/
│   │       ├── Domain/
│   │       ├── Application/
│   │       └── Infrastructure/
│   │
│   └── Shared/
│
└── Api (Minimal API)

🧩 Capas y responsabilidades

🔵 Domain (Entidades)

Contiene:

- Entidades
- Reglas de negocio

public class Persona
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public DateTime FechaNacimiento { get; set; }

    public int CalcularEdad()
    {
        var hoy = DateTime.Today;
        var edad = hoy.Year - FechaNacimiento.Year;
        if (FechaNacimiento > hoy.AddYears(-edad)) edad--;
        return edad;
    }
}

❌ No accede a base de datos
❌ No depende de otras capas

🟣 Application (Casos de uso)

Contiene:

- Interfaces
- Use Cases

public interface IPersonaRepository
{
    Task<IEnumerable<Persona>> GetAllAsync();
    Task AddAsync(Persona persona);
}

public class GetAllPersonasUseCase
{
    private readonly IPersonaRepository _repo;

    public GetAllPersonasUseCase(IPersonaRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<Persona>> Execute()
    {
        return await _repo.GetAllAsync();
    }
}

🎯 Responsabilidad:

- Orquestar lógica
- Aplicar reglas de negocio

🟡 Infrastructure (Datos)

Contiene:

- Implementación de repositorios
- Acceso a SQLite

public class PersonaRepository : IPersonaRepository
{
    // SQL y acceso a datos
}

🎯 Responsabilidad:

- Persistencia
- Conexión a base de datos

🌐 API (Presentación)

Contiene:

- Endpoints HTTP
- Minimal API

app.MapGet("/personas", async (GetAllPersonasUseCase useCase) =>
{
    var personas = await useCase.Execute();
    return Results.Ok(personas);
});

🎯 Responsabilidad:

- Exponer la aplicación vía HTTP
- No contiene lógica de negocio

🔄 Flujo de ejecución

Cliente HTTP
   ↓
Endpoint (API)
   ↓
Use Case (Application)
   ↓
Repositorio
   ↓
Base de datos

🧱 Pasos de migración

1. Separar módulos

Ejemplo:

- People
- Direcciones
- Contactos

2. Crear capas dentro del módulo

- Domain
- Application
- Infrastructure

3. Crear Class Library (Core)
dotnet new classlib -n Core

Mover:

- Modules
- Shared

4. Crear Minimal API
dotnet new web -n Api

5. Referenciar Core
dotnet add Api reference Core

6. Registrar dependencias
builder.Services.AddSingleton<SqliteConnectionFactory>();
builder.Services.AddScoped<IPersonaRepository, PersonaRepository>();

builder.Services.AddScoped<GetAllPersonasUseCase>();

7. Crear endpoints
app.MapPost("/personas", async (CreatePersonaUseCase useCase, Persona persona) =>
{
    await useCase.Execute(persona);
    return Results.Created($"/personas/{persona.Id}", persona);
});

⚠️ Nota sobre simplificaciones

Esta guía simplifica algunos aspectos para facilitar el aprendizaje:

- Algunos filtros pueden hacerse en memoria
- No se incluye manejo completo de errores
- No se implementan pruebas unitarias

En sistemas reales:

- Los filtros deben ejecutarse en base de datos
- Se debe manejar errores y validaciones
- Se deben incluir pruebas automatizadas

🚨 Reglas de arquitectura

✔ API → usa Use Cases
✔ Use Cases → usan interfaces
✔ Infrastructure → implementa interfaces

❌ API → NO accede directo a repositorios
❌ Domain → NO depende de otras capas
❌ Infrastructure → NO contiene lógica de negocio

📌 Buenas prácticas aplicadas

- Separación de responsabilidades
- Inyección de dependencias
- Modularidad
- Código mantenible
- Arquitectura escalable