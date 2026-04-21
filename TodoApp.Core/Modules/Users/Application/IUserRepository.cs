using Core.Shared.Interfaces;
using TodoApp.Core.Modules.Users.Domain;

namespace TodoApp.Core.Modules.Users.Application;

public interface IUserRepository : IGenericRepository<User, int>
{
    Task<User?> GetByEmailAsync(string email);
}
