using HabitTrackerApp.Core.Modules.Habitos.Domain;
using Core.Shared.Interfaces;

namespace HabitTrackerApp.Core.Modules.Habitos.Application;

public interface IHabitoRepository : IGenericRepository<Habito, int>
{
    Task<System.Collections.Generic.IEnumerable<Habito>> GetByUsuarioAsync(int idUsuario);
    Task<System.Collections.Generic.IEnumerable<Habito>> GetActivosAsync(int idUsuario);
}
