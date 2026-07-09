using System.Linq.Expressions;
using Corevia.First.Domain.Contracts.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Corevia.First.Application.Abstractions.Repositories;

public interface IRepository<T>
    where T : class
{
    Task<T> AddAsync(T entity, CancellationToken cancellationToken);
    Task AddRangeAsync(T[] entities, CancellationToken cancellationToken);
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken);
    Task<T> DeleteAsync(T entity, CancellationToken cancellationToken);
    Task<int> CountAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken);
    Task<T?> GetAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken, bool asNoTracking = true, params Expression<Func<T, object>>[] includes);
    Task<IList<T>> GetAllAsync(CancellationToken cancellationToken, bool asNoTracking = true, params Expression<Func<T, object>>[] includes);
    Task<IList<T>> GetAllAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken, bool asNoTracking = true, params Expression<Func<T, object>>[] includes);
    Task<PagedResult<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, CancellationToken cancellationToken, bool asNoTracking = true, params Expression<Func<T, object>>[] includes);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    DbSet<T> Query();
}
