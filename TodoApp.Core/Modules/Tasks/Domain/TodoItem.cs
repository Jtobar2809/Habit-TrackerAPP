namespace TodoApp.Core.Modules.Tasks.Domain;
using TodoApp.Core.Modules.Users.Domain;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    // Asociar la tarea a un usuario (nullable por compatibilidad)
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    // Navigation property populated via Dapper multi-mapping
    public User? User { get; set; }
}
