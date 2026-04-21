using Core.Shared.Interfaces;
using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Application;
using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Domain;
using HabitTrackerApp.Core.Modules.Habitos.Domain;

namespace HabitTrackerApp.Core.Modules.EstadisticasHabitos.Infrastructure;

public class EstadisticaHabitoRepository : IEstadisticaHabitoRepository
{
    private readonly IDapperHelper _db;

    public EstadisticaHabitoRepository(IDapperHelper db) => _db = db;

    public async Task<System.Collections.Generic.IEnumerable<EstadisticaHabito>> GetAllAsync()
    {
        var sql = @"SELECT e.Id, e.IdHabito, e.DiasCumplidos, e.RachaActual, e.Porcentaje, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM EstadisticasHabitos e
                    LEFT JOIN Habitos h ON e.IdHabito = h.Id";
        return await _db.QueryAsync<EstadisticaHabito, Habito, EstadisticaHabito>(sql, (e, h) => { e.Habito = h; return e; });
    }

    public async Task<EstadisticaHabito?> GetByIdAsync(int id)
    {
        var sql = @"SELECT e.Id, e.IdHabito, e.DiasCumplidos, e.RachaActual, e.Porcentaje, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM EstadisticasHabitos e
                    LEFT JOIN Habitos h ON e.IdHabito = h.Id
                    WHERE e.Id = @Id";
        var items = await _db.QueryAsync<EstadisticaHabito, Habito, EstadisticaHabito>(sql, (e, h) => { e.Habito = h; return e; }, new { Id = id });
        return items.FirstOrDefault();
    }

    public async Task<int> AddAsync(EstadisticaHabito entity)
    {
        var sql = "INSERT INTO EstadisticasHabitos (IdHabito, DiasCumplidos, RachaActual, Porcentaje) VALUES (@IdHabito, @DiasCumplidos, @RachaActual, @Porcentaje); SELECT last_insert_rowid();";
        var id = await _db.ExecuteScalarAsync<long>(sql, entity);
        entity.Id = (int)id;
        return entity.Id;
    }

    public async Task<int> UpdateAsync(EstadisticaHabito entity)
    {
        var rows = await _db.ExecuteAsync(
            "UPDATE EstadisticasHabitos SET IdHabito = @IdHabito, DiasCumplidos = @DiasCumplidos, RachaActual = @RachaActual, Porcentaje = @Porcentaje WHERE Id = @Id",
            entity);
        return rows;
    }

    public async Task<int> DeleteAsync(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM EstadisticasHabitos WHERE Id = @Id", new { Id = id });
        return rows;
    }

    public Task<System.Collections.Generic.IEnumerable<EstadisticaHabito>> GetByHabitoAsync(int idHabito)
    {
        var sql = @"SELECT e.Id, e.IdHabito, e.DiasCumplidos, e.RachaActual, e.Porcentaje, h.Id, h.Nombre, h.Descripcion, h.Activo, h.IdUsuario, h.FechaCreacion
                    FROM EstadisticasHabitos e
                    LEFT JOIN Habitos h ON e.IdHabito = h.Id
                    WHERE e.IdHabito = @IdHabito";
        return _db.QueryAsync<EstadisticaHabito, Habito, EstadisticaHabito>(sql, (e, h) => { e.Habito = h; return e; }, new { IdHabito = idHabito });
    }
}
