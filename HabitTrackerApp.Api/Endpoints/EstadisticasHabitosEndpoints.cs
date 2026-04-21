using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Domain;
using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Application;
using HabitTrackerApp.Core.Modules.Habitos.Application;

namespace HabitTrackerApp.Api.Endpoints;

public static class EstadisticasHabitosEndpoints
{
    public static void MapEstadisticasHabitosEndpoints(this WebApplication app)
    {
        var estadisticas = app.MapGroup("/estadisticas-habitos").WithTags("EstadisticasHabitos");

        // GET all
        estadisticas.MapGet("/", async (IEstadisticaHabitoRepository repo) =>
        {
            var items = await repo.GetAllAsync();
            return Results.Ok(items);
        });

        // GET by id
        estadisticas.MapGet("/{id:int}", async (int id, IEstadisticaHabitoRepository repo) =>
        {
            var item = await repo.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        // GET by habito
        estadisticas.MapGet("/habito/{idHabito:int}", async (int idHabito, IEstadisticaHabitoRepository repo) => Results.Ok(await repo.GetByHabitoAsync(idHabito)));

        // POST
        estadisticas.MapPost("/", async (EstadisticaHabito estadistica, IEstadisticaHabitoRepository repo, IHabitoRepository habitoRepo) =>
        {
            var habito = await habitoRepo.GetByIdAsync(estadistica.IdHabito);
            if (habito is null) return Results.BadRequest(new { error = "IdHabito no existe." });

            var id = await repo.AddAsync(estadistica);
            estadistica.Id = id;

            return Results.Created($"/estadisticas-habitos/{estadistica.Id}", estadistica);
        });

        // PUT
        estadisticas.MapPut("/{id:int}", async (int id, EstadisticaHabito estadistica, IEstadisticaHabitoRepository repo, IHabitoRepository habitoRepo) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            var habito = await habitoRepo.GetByIdAsync(estadistica.IdHabito);
            if (habito is null) return Results.BadRequest(new { error = "IdHabito no existe." });

            estadistica.Id = id;
            var rows = await repo.UpdateAsync(estadistica);
            if (rows == 0) return Results.NotFound();

            return Results.Ok(estadistica);
        });

        // DELETE
        estadisticas.MapDelete("/{id:int}", async (int id, IEstadisticaHabitoRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}
