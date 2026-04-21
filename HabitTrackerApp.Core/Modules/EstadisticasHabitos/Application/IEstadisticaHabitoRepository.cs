using HabitTrackerApp.Core.Modules.EstadisticasHabitos.Domain;
using Core.Shared.Interfaces;

namespace HabitTrackerApp.Core.Modules.EstadisticasHabitos.Application;

public interface IEstadisticaHabitoRepository : IGenericRepository<EstadisticaHabito, int>
{
    Task<System.Collections.Generic.IEnumerable<EstadisticaHabito>> GetByHabitoAsync(int idHabito);
}
