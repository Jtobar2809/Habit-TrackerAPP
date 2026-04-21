using Core.Shared.Interfaces;
using Dapper;
using Microsoft.Data.Sqlite;

namespace Core.Shared.Infrastructure;

public class DapperHelper : IDapperHelper
{
    private readonly string _connectionString;

    public DapperHelper(string connectionString) => _connectionString = connectionString;

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
    {
        using var connection = new SqliteConnection(_connectionString);
        return await connection.QueryAsync<T>(sql, param);
    }

    public async Task<IEnumerable<TReturn>> QueryAsync<T1, T2, TReturn>(string sql, Func<T1, T2, TReturn> map, object? param = null, string splitOn = "Id")
    {
        using var connection = new SqliteConnection(_connectionString);
        return await connection.QueryAsync<T1, T2, TReturn>(sql, map, param, splitOn: splitOn);
    }

    public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, object? param = null)
    {
        using var connection = new SqliteConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<T>(sql, param);
    }

    public async Task<int> ExecuteAsync(string sql, object? param = null)
    {
        using var connection = new SqliteConnection(_connectionString);
        return await connection.ExecuteAsync(sql, param);
    }

    public async Task<T> ExecuteScalarAsync<T>(string sql, object? param = null)
    {
        using var connection = new SqliteConnection(_connectionString);
        return (await connection.ExecuteScalarAsync<T>(sql, param))!;
    }
}
