using TodoApp.Core.Modules.Users.Domain;

namespace TodoApp.Core.Modules.Habitos.Domain;

public class Habito
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
    public int IdUsuario { get; set; }
    public DateTime FechaCreacion { get; set; }
    // Navigation
    public User? User { get; set; }
}
