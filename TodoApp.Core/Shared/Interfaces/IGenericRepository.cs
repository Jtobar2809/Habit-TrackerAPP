using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Shared.Interfaces;

public interface IGenericRepository<T, TKey> where T : class
{
    /// <summary>Devuelve todos los registros de la entidad.</summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>Devuelve un registro por su clave primaria, o null si no existe.</summary>
    Task<T?> GetByIdAsync(TKey id);

    /// <summary>Inserta un nuevo registro y devuelve el número de filas afectadas.</summary>
    Task<int> AddAsync(T entity);

    /// <summary>Actualiza un registro existente y devuelve el número de filas afectadas.</summary>
    Task<int> UpdateAsync(T entity);

    /// <summary>Elimina un registro por su clave primaria y devuelve el número de filas afectadas.</summary>
    Task<int> DeleteAsync(TKey id);
}
