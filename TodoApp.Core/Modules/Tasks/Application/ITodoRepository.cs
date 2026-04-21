using Core.Shared.Interfaces;
using TodoApp.Core.Modules.Tasks.Domain;

namespace TodoApp.Core.Modules.Tasks.Application;

public interface ITodoRepository : IGenericRepository<TodoItem, int>
{
    Task<IEnumerable<TodoItem>> GetCompletedAsync();
    Task<IEnumerable<TodoItem>> GetPendingAsync();
    Task<IEnumerable<TodoItem>> GetByUserAsync(int userId);
}
