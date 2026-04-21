using HabitTrackerApp.Core.Modules.Habitos.Domain;
using HabitTrackerApp.Core.Modules.Habitos.Application;
using HabitTrackerApp.Core.Modules.Users.Application;

namespace HabitTrackerApp.Api.Endpoints;

public static class HabitosEndpoints
{
    public static void MapHabitosEndpoints(this WebApplication app)
    {
        var habitos = app.MapGroup("/habitos").WithTags("Habitos");

        // GET all
        habitos.MapGet("/", async (IHabitoRepository repo) =>
        {
            var items = await repo.GetAllAsync();
            return Results.Ok(items);
        });

        // GET by id
        habitos.MapGet("/{id:int}", async (int id, IHabitoRepository repo) =>
        {
            var item = await repo.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        // GET by user
        habitos.MapGet("/usuario/{idUsuario:int}", async (int idUsuario, IHabitoRepository repo) => Results.Ok(await repo.GetByUsuarioAsync(idUsuario)));

        // GET activos by user
        habitos.MapGet("/usuario/{idUsuario:int}/activos", async (int idUsuario, IHabitoRepository repo) => Results.Ok(await repo.GetActivosAsync(idUsuario)));

        // POST
        habitos.MapPost("/", async (Habito habito, IHabitoRepository repo, IUserRepository userRepo) =>
        {
            if (string.IsNullOrWhiteSpace(habito.Nombre) || habito.Nombre.Length > 200)
                return Results.BadRequest(new { error = "Nombre requerido (1-200 chars)." });

            var user = await userRepo.GetByIdAsync(habito.IdUsuario);
            if (user is null) return Results.BadRequest(new { error = "IdUsuario no existe." });

            habito.FechaCreacion = DateTime.UtcNow;
            var id = await repo.AddAsync(habito);
            habito.Id = id;

            return Results.Created($"/habitos/{habito.Id}", habito);
        });

        // PUT
        habitos.MapPut("/{id:int}", async (int id, Habito habito, IHabitoRepository repo, IUserRepository userRepo) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();

            if (string.IsNullOrWhiteSpace(habito.Nombre) || habito.Nombre.Length > 200)
                return Results.BadRequest(new { error = "Nombre requerido (1-200 chars)." });

            var user = await userRepo.GetByIdAsync(habito.IdUsuario);
            if (user is null) return Results.BadRequest(new { error = "IdUsuario no existe." });

            habito.Id = id;
            var rows = await repo.UpdateAsync(habito);
            if (rows == 0) return Results.NotFound();

            return Results.Ok(habito);
        });

        // DELETE
        habitos.MapDelete("/{id:int}", async (int id, IHabitoRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}
