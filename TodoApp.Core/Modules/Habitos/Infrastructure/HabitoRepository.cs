using Core.Shared.Interfaces;
using TodoApp.Core.Modules.Habitos.Application;
using TodoApp.Core.Modules.Habitos.Domain;
using TodoApp.Core.Modules.Users.Domain;

namespace TodoApp.Core.Modules.Habitos.Infrastructure;

public class HabitoRepository : IHabitoRepository
{
    private readonly IDapperHelper _db;

    public HabitoRepository(IDapperHelper db) => _db = db;

    public async Task<System.Collections.Generic.IEnumerable<Habito>> GetAllAsync()
    {
        var sql = @"SELECT h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM Habitos h
                    LEFT JOIN Users u ON h.IdUsuario = u.Id";
        return await _db.QueryAsync<Habito, User, Habito>(sql, (h, u) => { h.User = u; return h; });
    }

    public async Task<Habito?> GetByIdAsync(int id)
    {
        var sql = @"SELECT h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM Habitos h
                    LEFT JOIN Users u ON h.IdUsuario = u.Id
                    WHERE h.Id = @Id";
        var items = await _db.QueryAsync<Habito, User, Habito>(sql, (h, u) => { h.User = u; return h; }, new { Id = id });
        return items.FirstOrDefault();
    }

    public async Task<int> AddAsync(Habito entity)
    {
        var sql = "INSERT INTO Habitos (Nombre, Descripcion, Activo, FechaCreacion, IdUsuario) VALUES (@Nombre, @Descripcion, @Activo, @FechaCreacion, @IdUsuario); SELECT last_insert_rowid();";
        var id = await _db.ExecuteScalarAsync<long>(sql, entity);
        entity.Id = (int)id;
        return entity.Id;
    }

    public async Task<int> UpdateAsync(Habito entity)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE Habitos SET Nombre = @Nombre, Descripcion = @Descripcion, Activo = @Activo, IdUsuario = @IdUsuario WHERE Id = @Id",
            entity);
        return rows;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM Habitos WHERE Id = @Id", new { Id = id });
        return rows;
    }

    public Task<System.Collections.Generic.IEnumerable<Habito>> GetByUsuarioAsync(int idUsuario)
    {
        var sql = @"SELECT h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM Habitos h
                    LEFT JOIN Users u ON h.IdUsuario = u.Id
                    WHERE h.IdUsuario = @IdUsuario";
        return _db.QueryAsync<Habito, User, Habito>(sql, (h, u) => { h.User = u; return h; }, new { IdUsuario = idUsuario });
    }

    public Task<System.Collections.Generic.IEnumerable<Habito>> GetActivosAsync(int idUsuario)
    {
        var sql = @"SELECT h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion, u.Id, u.Name, u.Email, u.CreatedAt
                    FROM Habitos h
                    LEFT JOIN Users u ON h.IdUsuario = u.Id
                    WHERE h.IdUsuario = @IdUsuario AND h.Activo = 1";
        return _db.QueryAsync<Habito, User, Habito>(sql, (h, u) => { h.User = u; return h; }, new { IdUsuario = idUsuario });
    }
}
