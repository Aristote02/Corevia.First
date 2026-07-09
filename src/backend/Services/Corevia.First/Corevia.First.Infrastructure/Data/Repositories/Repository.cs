using System.Linq.Expressions;
using Corevia.First.Application.Abstractions.Repositories;
using Corevia.First.Domain.Contracts.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Corevia.First.Infrastructure.Data.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected CoreviaFirstDbContext Context { get; }
    protected DbSet<T> DbSet { get; }

    public Repository(CoreviaFirstDbContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken)
    {
        var result = await DbSet.AddAsync(entity, cancellationToken);
        return result.Entity;
    }

    public async Task AddRangeAsync(T[] entities, CancellationToken cancellationToken)
    {
        await DbSet.AddRangeAsync(entities, cancellationToken);
        await Context.SaveChangesAsync(cancellationToken);
    }

    public Task<T> UpdateAsync(T entity, CancellationToken cancellationToken)
    {
        var result = DbSet.Update(entity);
        return Task.FromResult(result.Entity);
    }

    public Task<T> DeleteAsync(T entity, CancellationToken cancellationToken)
    {
        var result = DbSet.Remove(entity);
        return Task.FromResult(result.Entity);
    }

    public Task<int> CountAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken) =>
        DbSet.AsNoTracking().CountAsync(predicate, cancellationToken);

    public Task<T?> GetAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken,
        bool asNoTracking = true,
        params Expression<Func<T, object>>[] includes) =>
        DbSet
            .ApplyTracking(asNoTracking)
            .Includes(includes)
            .FirstOrDefaultAsync(predicate, cancellationToken);

    public async Task<IList<T>> GetAllAsync(
        CancellationToken cancellationToken,
        bool asNoTracking = true,
        params Expression<Func<T, object>>[] includes) =>
        await DbSet
            .ApplyTracking(asNoTracking)
            .Includes(includes)
            .ToListAsync(cancellationToken);

    public async Task<IList<T>> GetAllAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken,
        bool asNoTracking = true,
        params Expression<Func<T, object>>[] includes) =>
        await DbSet
            .ApplyTracking(asNoTracking)
            .WhereIf(predicate)
            .Includes(includes)
            .ToListAsync(cancellationToken);

    public async Task<PagedResult<T>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<T, bool>> predicate,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy,
        CancellationToken cancellationToken,
        bool asNoTracking = true,
        params Expression<Func<T, object>>[] includes)
    {
        var query = DbSet
            .ApplyTracking(asNoTracking)
            .WhereIf(predicate)
            .Includes(includes);

        query = orderBy(query);
        var totalCount = await query.CountAsync(cancellationToken);

        if (totalCount > 0 && (pageNumber - 1) * pageSize >= totalCount)
            pageNumber = 1;

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        Context.SaveChangesAsync(cancellationToken);

    public DbSet<T> Query() => Context.Set<T>();
}
