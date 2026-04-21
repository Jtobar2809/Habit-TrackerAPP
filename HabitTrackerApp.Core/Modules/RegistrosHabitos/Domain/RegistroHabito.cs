using HabitTrackerApp.Core.Modules.Habitos.Domain;

namespace HabitTrackerApp.Core.Modules.RegistrosHabitos.Domain;

public class RegistroHabito
{
    public int Id { get; set; }
    public int IdHabito { get; set; }
    public DateTime Fecha { get; set; }
    public bool Cumplido { get; set; }
    // Navigation
    public Habito? Habito { get; set; }
}
