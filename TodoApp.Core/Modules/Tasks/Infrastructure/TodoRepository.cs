using Core.Shared.Interfaces;
using TodoApp.Core.Modules.Tasks.Application;
using TodoApp.Core.Modules.Tasks.Domain;
using TodoApp.Core.Modules.Users.Domain;

namespace TodoApp.Core.Modules.Tasks.Infrastructure;

public class TodoRepository : ITodoRepository
{
    private readonly IDapperHelper _db;

    public TodoRepository(IDapperHelper db) => _db = db;

    public Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        var sql = @"SELECT t.Id, t.Title, t.IsCompleted, t.UserId, t.CreatedAt, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM TodoItems t
                    LEFT JOIN Users u ON t.UserId = u.Id";
        return _db.QueryAsync<TodoItem, User, TodoItem>(sql, (t, u) => { t.User = u; return t; });
    }

    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        var sql = @"SELECT t.Id, t.Title, t.IsCompleted, t.UserId, t.CreatedAt, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM TodoItems t
                    LEFT JOIN Users u ON t.UserId = u.Id
                    WHERE t.Id = @Id";
        var items = await _db.QueryAsync<TodoItem, User, TodoItem>(sql, (t, u) => { t.User = u; return t; }, new { Id = id });
        return items.FirstOrDefault();
    }

    public async Task<int> AddAsync(TodoItem entity)
    {
        var sql = "INSERT INTO TodoItems (Title, IsCompleted, CreatedAt, UserId) VALUES (@Title, @IsCompleted, @CreatedAt, @UserId); SELECT last_insert_rowid();";
        var id = await _db.ExecuteScalarAsync<long>(sql, entity);
        entity.Id = (int)id;
        return entity.Id;
    }

    public async Task<int> UpdateAsync(TodoItem entity)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE TodoItems SET Title = @Title, IsCompleted = @IsCompleted, UserId = @UserId WHERE Id = @Id",
            entity);
        return rows;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM TodoItems WHERE Id = @Id", new { Id = id });
        return rows;
    }

    public Task<IEnumerable<TodoItem>> GetCompletedAsync()
    {
        var sql = @"SELECT t.Id, t.Title, t.IsCompleted, t.UserId, t.CreatedAt, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM TodoItems t
                    LEFT JOIN Users u ON t.UserId = u.Id
                    WHERE t.IsCompleted = 1";
        return _db.QueryAsync<TodoItem, User, TodoItem>(sql, (t, u) => { t.User = u; return t; });
    }

    public Task<IEnumerable<TodoItem>> GetPendingAsync()
    {
        var sql = @"SELECT t.Id, t.Title, t.IsCompleted, t.UserId, t.CreatedAt, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM TodoItems t
                    LEFT JOIN Users u ON t.UserId = u.Id
                    WHERE t.IsCompleted = 0";
        return _db.QueryAsync<TodoItem, User, TodoItem>(sql, (t, u) => { t.User = u; return t; });
    }

    public Task<IEnumerable<TodoItem>> GetByUserAsync(int userId)
    {
        var sql = @"SELECT t.Id, t.Title, t.IsCompleted, t.UserId, t.CreatedAt, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM TodoItems t
                    LEFT JOIN Users u ON t.UserId = u.Id
                    WHERE t.UserId = @UserId";
        return _db.QueryAsync<TodoItem, User, TodoItem>(sql, (t, u) => { t.User = u; return t; }, new { UserId = userId });
    }
}
