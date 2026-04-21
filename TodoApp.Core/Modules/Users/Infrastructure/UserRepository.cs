using Core.Shared.Interfaces;
using TodoApp.Core.Modules.Users.Application;
using TodoApp.Core.Modules.Users.Domain;

namespace TodoApp.Core.Modules.Users.Infrastructure;

public class UserRepository : IUserRepository
{
    private readonly IDapperHelper _db;

    public UserRepository(IDapperHelper db) => _db = db;

    public Task<IEnumerable<User>> GetAllAsync() =>
        _db.QueryAsync<User>("SELECT * FROM Users");

    public Task<User?> GetByIdAsync(int id) =>
        _db.QueryFirstOrDefaultAsync<User>("SELECT * FROM Users WHERE Id = @Id", new { Id = id });

    public async Task<int> AddAsync(User entity)
    {
        var sql = "INSERT INTO Users (Name, Email, CreatedAt) VALUES (@Name, @Email, @CreatedAt); SELECT last_insert_rowid();";
        var id = await _db.ExecuteScalarAsync<long>(sql, entity);
        entity.Id = (int)id;
        return entity.Id;
    }

    public async Task<int> UpdateAsync(User entity)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE Users SET Name = @Name, Email = @Email WHERE Id = @Id",
            entity);
        return rows;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM Users WHERE Id = @Id", new { Id = id });
        return rows;
    }

    public Task<User?> GetByEmailAsync(string email) =>
        _db.QueryFirstOrDefaultAsync<User>("SELECT * FROM Users WHERE Email = @Email", new { Email = email });
}
