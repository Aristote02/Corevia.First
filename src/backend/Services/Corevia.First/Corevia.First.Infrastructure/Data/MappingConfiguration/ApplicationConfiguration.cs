using ApplicationEntity = Corevia.First.Domain.Entities.Application;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class ApplicationConfiguration : IEntityTypeConfiguration<ApplicationEntity>
{
    public void Configure(EntityTypeBuilder<ApplicationEntity> e)
    {
        e.ToTable("applications");
        e.HasIndex(a => a.ApplicationNumber).IsUnique();
        e.HasIndex(a => a.Status);
        e.HasIndex(a => a.AdminStatus);
        e.Property(a => a.ApplicationNumber).HasMaxLength(32);
    }
}
