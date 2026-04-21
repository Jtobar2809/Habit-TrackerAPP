using TodoApp.Core.Modules.Habitos.Domain;

namespace TodoApp.Core.Modules.EstadisticasHabitos.Domain;

public class EstadisticaHabito
{
    public int Id { get; set; }
    public int IdHabito { get; set; }
    public int DiasCumplidos { get; set; }
    public int RachaActual { get; set; }
    public double Porcentaje { get; set; }
    // Navigation
    public Habito? Habito { get; set; }
}
