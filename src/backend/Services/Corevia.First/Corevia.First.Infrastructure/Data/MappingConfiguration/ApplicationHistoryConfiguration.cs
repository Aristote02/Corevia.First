using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class ApplicationHistoryConfiguration : IEntityTypeConfiguration<ApplicationHistory>
{
    public void Configure(EntityTypeBuilder<ApplicationHistory> e)
    {
        e.ToTable("application_history");
        e.HasOne(h => h.Application)
            .WithMany(a => a.History)
            .HasForeignKey(h => h.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);
        e.HasOne(h => h.ChangedByUser)
            .WithMany()
            .HasForeignKey(h => h.ChangedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
