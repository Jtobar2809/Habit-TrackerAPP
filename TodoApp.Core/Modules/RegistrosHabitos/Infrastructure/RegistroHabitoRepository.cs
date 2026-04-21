using Core.Shared.Interfaces;
using TodoApp.Core.Modules.RegistrosHabitos.Application;
using TodoApp.Core.Modules.RegistrosHabitos.Domain;
using TodoApp.Core.Modules.Habitos.Domain;

namespace TodoApp.Core.Modules.RegistrosHabitos.Infrastructure;

public class RegistroHabitoRepository : IRegistroHabitoRepository
{
    private readonly IDapperHelper _db;

    public RegistroHabitoRepository(IDapperHelper db) => _db = db;

    public async Task<System.Collections.Generic.IEnumerable<RegistroHabito>> GetAllAsync()
    {
        var sql = @"SELECT r.Id, r.IdHabito, r.Fecha, r.Cumplido, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM RegistrosHabitos r
                    LEFT JOIN Habitos h ON r.IdHabito = h.Id";
        return await _db.QueryAsync<RegistroHabito, Habito, RegistroHabito>(sql, (r, h) => { r.Habito = h; return r; });
    }

    public async Task<RegistroHabito?> GetByIdAsync(int id)
    {
        var sql = @"SELECT r.Id, r.IdHabito, r.Fecha, r.Cumplido, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM RegistrosHabitos r
                    LEFT JOIN Habitos h ON r.IdHabito = h.Id
                    WHERE r.Id = @Id";
        var items = await _db.QueryAsync<RegistroHabito, Habito, RegistroHabito>(sql, (r, h) => { r.Habito = h; return r; }, new { Id = id });
        return items.FirstOrDefault();
    }

    public async Task<int> AddAsync(RegistroHabito entity)
    {
        var sql = "INSERT INTO RegistrosHabitos (IdHabito, Fecha, Cumplido) VALUES (@IdHabito, @Fecha, @Cumplido); SELECT last_insert_rowid();";
        var id = await _db.ExecuteScalarAsync<long>(sql, entity);
        entity.Id = (int)id;
        return entity.Id;
    }

    public async Task<int> UpdateAsync(RegistroHabito entity)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE RegistrosHabitos SET IdHabito = @IdHabito, Fecha = @Fecha, Cumplido = @Cumplido WHERE Id = @Id",
            entity);
        return rows;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM RegistrosHabitos WHERE Id = @Id", new { Id = id });
        return rows;
    }

    public Task<System.Collections.Generic.IEnumerable<RegistroHabito>> GetByHabitoAsync(int idHabito)
    {
        var sql = @"SELECT r.Id, r.IdHabito, r.Fecha, r.Cumplido, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM RegistrosHabitos r
                    LEFT JOIN Habitos h ON r.IdHabito = h.Id
                    WHERE r.IdHabito = @IdHabito";
        return _db.QueryAsync<RegistroHabito, Habito, RegistroHabito>(sql, (r, h) => { r.Habito = h; return r; }, new { IdHabito = idHabito });
    }
}
