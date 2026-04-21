
namespace Core.Shared.Interfaces;

public interface IDapperHelper
{
    Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null);
    Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object? param = null);
    Task<int> ExecuteAsync(string sql, object? param = null);

    // Multi-mapping support for Dapper (two types)
    Task<IEnumerable<TReturn>> QueryAsync<T1, T2, TReturn>(string sql, Func<T1, T2, TReturn> map, object? param = null, string splitOn = "Id");

    // Execute scalar (e.g., retrieve last_insert_rowid)
    Task<T> ExecuteScalarAsync<T>(string sql, object? param = null);
}
