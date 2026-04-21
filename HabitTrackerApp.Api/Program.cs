using Core.Shared.Interfaces;
using Core.Shared.Infrastructure;
using HabitTrackerApp.Core.Modules.Users.Application;
using HabitTrackerApp.Core.Modules.Users.Infrastructure;
using HabitTrackerApp.Api.Endpoints;
using HabitTrackerApp.Core.Modules.Habitos.Application;
using HabitTrackerApp.Core.Modules.Habitos.Infrastructure;
using HabitTrackerApp.Core.Modules.RegistrosHabitos.Application;
using HabitTrackerApp.Core.Modules.RegistrosHabitos.Infrastructure;
using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Application;
using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---

// OpenAPI (native)
// builder.Services.AddOpenApi();

// Swagger (UI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Core services (Dapper, repositories, etc.) — registered manually
var conn = builder.Configuration.GetConnectionString("Default")
    ?? builder.Configuration["ConnectionStrings:Default"]
    ?? "Data Source=..\\HabitTrackerApp.Core\\Data\\todo.db";

builder.Services.AddSingleton<IDapperHelper>(_ => new DapperHelper(conn));
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IHabitoRepository, HabitoRepository>();
builder.Services.AddTransient<IRegistroHabitoRepository, RegistroHabitoRepository>();
builder.Services.AddTransient<IEstadisticaHabitoRepository, EstadisticaHabitoRepository>();

var app = builder.Build();

// --- Middleware ---

if (app.Environment.IsDevelopment())
{
    // OpenAPI JSON
    // app.MapOpenApi(); // => /openapi/v1.json

    // Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- Endpoints ---

// Map endpoints using extension methods
app.MapUserEndpoints();
app.MapHabitosEndpoints();
app.MapRegistrosHabitosEndpoints();
app.MapEstadisticasHabitosEndpoints();

app.Run();