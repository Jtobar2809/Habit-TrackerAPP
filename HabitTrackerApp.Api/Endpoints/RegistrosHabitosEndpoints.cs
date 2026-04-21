using HabitTrackerApp.Core.Modules.RegistrosHabitos.Domain;
using HabitTrackerApp.Core.Modules.RegistrosHabitos.Application;
using HabitTrackerApp.Core.Modules.Habitos.Application;

namespace HabitTrackerApp.Api.Endpoints;

public static class RegistrosHabitosEndpoints
{
    public static void MapRegistrosHabitosEndpoints(this WebApplication app)
    {
        var registros = app.MapGroup("/registros-habitos").WithTags("RegistrosHabitos");

        // GET all
        registros.MapGet("/", async (IRegistroHabitoRepository repo) =>
        {
            var items = await repo.GetAllAsync();
            return Results.Ok(items);
        });

        // GET by id
        registros.MapGet("/{id:int}", async (int id, IRegistroHabitoRepository repo) =>
        {
            var item = await repo.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        // GET by habito
        registros.MapGet("/habito/{idHabito:int}", async (int idHabito, IRegistroHabitoRepository repo) => Results.Ok(await repo.GetByHabitoAsync(idHabito)));

        // POST
        registros.MapPost("/", async (RegistroHabito registro, IRegistroHabitoRepository repo, IHabitoRepository habitoRepo) =>
        {
            var habito = await habitoRepo.GetByIdAsync(registro.IdHabito);
            if (habito is null) return Results.BadRequest(new { error = "IdHabito no existe." });

            var id = await repo.AddAsync(registro);
            registro.Id = id;

            return Results.Created($"/registros-habitos/{registro.Id}", registro);
        });

        // PUT
        registros.MapPut("/{id:int}", async (int id, RegistroHabito registro, IRegistroHabitoRepository repo, IHabitoRepository habitoRepo) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            var habito = await habitoRepo.GetByIdAsync(registro.IdHabito);
            if (habito is null) return Results.BadRequest(new { error = "IdHabito no existe." });

            registro.Id = id;
            var rows = await repo.UpdateAsync(registro);
            if (rows == 0) return Results.NotFound();

            return Results.Ok(registro);
        });

        // DELETE
        registros.MapDelete("/{id:int}", async (int id, IRegistroHabitoRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}
