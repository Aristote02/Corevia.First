using System.Linq.Expressions;
using Corevia.First.Application.Abstractions.Repositories;
using MockQueryable.NSubstitute;

namespace Corevia.First.UnitTests.Common;

internal static class RepositoryMockExtensions
{
    public static void ReturnsQueryable<TEntity>(this IRepository<TEntity> repository, IEnumerable<TEntity> entities)
        where TEntity : class
    {
        var dbSet = entities.ToList().BuildMockDbSet<TEntity>();
        repository.Query().Returns(dbSet);
    }

    public static void ReturnsGetByPredicate<TEntity>(this IRepository<TEntity> repository, IEnumerable<TEntity> entities) where TEntity : class
    {
        repository
            .GetAsync(
                Arg.Any<Expression<Func<TEntity, bool>>>(),
                Arg.Any<CancellationToken>(),
                Arg.Any<bool>(),
                Arg.Any<Expression<Func<TEntity, object>>[]>())
            .Returns(callInfo =>
            {
                var predicate = callInfo.Arg<Expression<Func<TEntity, bool>>>().Compile();
                return Task.FromResult(entities.FirstOrDefault(predicate));
            });
    }

    public static void ReturnsCount<TEntity>(this IRepository<TEntity> repository, IEnumerable<TEntity> entities)
        where TEntity : class
    {
        repository
            .CountAsync(Arg.Any<Expression<Func<TEntity, bool>>>(), Arg.Any<CancellationToken>())
            .Returns(callInfo =>
            {
                var predicate = callInfo.Arg<Expression<Func<TEntity, bool>>>().Compile();
                return Task.FromResult(entities.Count(predicate));
            });
    }

    public static void ReturnsPersistedAdd<TEntity>(this IRepository<TEntity> repository)
        where TEntity : class
    {
        repository
            .AddAsync(Arg.Any<TEntity>(), Arg.Any<CancellationToken>())
            .Returns(callInfo => Task.FromResult(callInfo.Arg<TEntity>()));

        repository
            .SaveChangesAsync(Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(1));
    }

    public static void ReturnsDeleted<TEntity>(this IRepository<TEntity> repository)
        where TEntity : class
    {
        repository
            .DeleteAsync(Arg.Any<TEntity>(), Arg.Any<CancellationToken>())
            .Returns(callInfo => Task.FromResult(callInfo.Arg<TEntity>()));

        repository
            .SaveChangesAsync(Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(1));
    }
}
