using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data;

public static class EntityTypeBuilderExtensions
{
    public static PropertyBuilder<List<string>> ConfigureJsonList<TEntity>(
        this EntityTypeBuilder<TEntity> builder,
        Expression<Func<TEntity, List<string>>> propertyExpression)
        where TEntity : class =>
        builder.Property(propertyExpression)
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'[]'::jsonb");
}
