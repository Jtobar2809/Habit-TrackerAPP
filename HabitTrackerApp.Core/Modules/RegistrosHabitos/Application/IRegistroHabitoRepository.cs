using HabitTrackerApp.Core.Modules.RegistrosHabitos.Domain;
using Core.Shared.Interfaces;

namespace HabitTrackerApp.Core.Modules.RegistrosHabitos.Application;

public interface IRegistroHabitoRepository : IGenericRepository<RegistroHabito, int>
{
    Task<System.Collections.Generic.IEnumerable<RegistroHabito>> GetByHabitoAsync(int idHabito);
}
