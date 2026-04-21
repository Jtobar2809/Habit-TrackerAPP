using Core.Shared.Interfaces;
using HabitTrackerApp.Core.Modules.Users.Domain;

namespace HabitTrackerApp.Core.Modules.Users.Application;

public interface IUserRepository : IGenericRepository<User, int>
{
    Task<User?> GetByEmailAsync(string email);
}
