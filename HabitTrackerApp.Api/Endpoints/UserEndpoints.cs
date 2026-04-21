using HabitTrackerApp.Core.Modules.Users.Domain;
using HabitTrackerApp.Core.Modules.Users.Application;

namespace HabitTrackerApp.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        var users = app.MapGroup("/users").WithTags("Users");

        // GET all users
        users.MapGet("/", async (IUserRepository repo) => Results.Ok(await repo.GetAllAsync()));

        // GET user by id
        users.MapGet("/{id:int}", async (int id, IUserRepository repo) =>
        {
            var user = await repo.GetByIdAsync(id);
            return user is null ? Results.NotFound() : Results.Ok(user);
        });

        // GET user by email
        users.MapGet("/by-email/{email}", async (string email, IUserRepository repo) =>
        {
            var user = await repo.GetByEmailAsync(email);
            return user is null ? Results.NotFound() : Results.Ok(user);
        });

        // POST create user
        users.MapPost("/", async (User user, IUserRepository repo) =>
        {
            if (string.IsNullOrWhiteSpace(user.Name) || user.Name.Length > 200)
                return Results.BadRequest(new { error = "Name is required and must be 1..200 chars." });
            if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
                return Results.BadRequest(new { error = "Valid Email is required." });

            user.CreatedAt = DateTime.UtcNow;
            var id = await repo.AddAsync(user);
            user.Id = id;
            return Results.Created($"/users/{user.Id}", user);
        });

        // PUT update user
        users.MapPut("/{id:int}", async (int id, User user, IUserRepository repo) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null) return Results.NotFound();
            if (string.IsNullOrWhiteSpace(user.Name) || user.Name.Length > 200)
                return Results.BadRequest(new { error = "Name is required and must be 1..200 chars." });
            if (string.IsNullOrWhiteSpace(user.Email) || !user.Email.Contains("@"))
                return Results.BadRequest(new { error = "Valid Email is required." });

            user.Id = id;
            var rows = await repo.UpdateAsync(user);
            if (rows == 0) return Results.NotFound();
            return Results.Ok(user);
        });

        // DELETE user
        users.MapDelete("/{id:int}", async (int id, IUserRepository repo) =>
        {
            var rows = await repo.DeleteAsync(id);
            return rows > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}
