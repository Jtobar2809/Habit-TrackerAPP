using TodoApp.Core.Modules.Tasks.Domain;
using TodoApp.Core.Modules.Tasks.Application;

namespace TodoApp.Api.Endpoints;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this WebApplication app)
    {
        var todos = app.MapGroup("/todos").WithTags("Todos");

        // GET all
        todos.MapGet("/", async (ITodoRepository repo) =>
        {
            var items = await repo.GetAllAsync();
            return Results.Ok(items);
        });

        // GET by id
        todos.MapGet("/{id:int}", async (int id, ITodoRepository repo) =>
        {
            var item = await repo.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        // GET completed
        todos.MapGet("/completed", async (ITodoRepository repo) => Results.Ok(await repo.GetCompletedAsync()));

        // GET pending
        todos.MapGet("/pending", async (ITodoRepository repo) => Results.Ok(await repo.GetPendingAsync()));

        // GET by user
        todos.MapGet("/user/{userId:int}", async (int userId, ITodoRepository repo) => Results.Ok(await repo.GetByUserAsync(userId)));

        // POST
        todos.MapPost("/", async (TodoItem todo, ITodoRepository repo, TodoApp.Core.Modules.Users.Application.IUserRepository userRepo) =>
        {
            if (string.IsNullOrWhiteSpace(todo.Title) || todo.Title.Length > 200)
                return Results.BadRequest(new { error = "Title is required and must be 1..200 chars." });

            if (todo.UserId.HasValue)
            {
                var user = await userRepo.GetByIdAsync(todo.UserId.Value);
                if (user is null) return Results.BadRequest(new { error = "UserId does not exist." });
            }

            todo.CreatedAt = DateTime.UtcNow;
            var id = await repo.AddAsync(todo);
            todo.Id = id;

            return Results.Created($"/todos/{todo.Id}", todo);
        });

        // PUT
        todos.MapPut("/{id:int}", async (int id, TodoItem todo, ITodoRepository repo, TodoApp.Core.Modules.Users.Application.IUserRepository userRepo) =>
        {
            var existing = await repo.GetByIdAsync(id);
            if (existing is null)
                return Results.NotFound();

            if (string.IsNullOrWhiteSpace(todo.Title) || todo.Title.Length > 200)
                return Results.BadRequest(new { error = "Title is required and must be 1..200 chars." });

            if (todo.UserId.HasValue)
            {
                var user = await userRepo.GetByIdAsync(todo.UserId.Value);
                if (user is null) return Results.BadRequest(new { error = "UserId does not exist." });
            }

            todo.Id = id;
            var rows = await repo.UpdateAsync(todo);
            if (rows == 0) return Results.NotFound();

            return Results.Ok(todo);
        });

        // DELETE
        todos.MapDelete("/{id:int}", async (int id, ITodoRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted > 0 ? Results.NoContent() : Results.NotFound();
        });
    }
}
