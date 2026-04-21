using TodoApp.Core.Modules.RegistrosHabitos.Domain;
using Core.Shared.Interfaces;

namespace TodoApp.Core.Modules.RegistrosHabitos.Application;

public interface IRegistroHabitoRepository : IGenericRepository<RegistroHabito, int>
{
    Task<System.Collections.Generic.IEnumerable<RegistroHabito>> GetByHabitoAsync(int idHabito);
}
