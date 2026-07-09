using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> e)
    {
        e.ToTable("users");
        e.HasIndex(u => u.Email).IsUnique();
        e.HasIndex(u => u.SupabaseAuthId).IsUnique().HasFilter("\"SupabaseAuthId\" IS NOT NULL");
        e.Property(u => u.Email).HasMaxLength(320);
        e.Property(u => u.FullName).HasMaxLength(200);
        e.Property(u => u.Phone).HasMaxLength(50);
        e.Property(u => u.Country).HasMaxLength(100);
        e.HasMany(u => u.RefreshTokens)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        e.HasMany(u => u.Applications)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
