using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class AgencyServiceConfiguration : IEntityTypeConfiguration<AgencyService>
{
    public void Configure(EntityTypeBuilder<AgencyService> e)
    {
        e.ToTable("services");
        e.ConfigureJsonList(s => s.Features);
        e.Property(s => s.Price).HasPrecision(10, 2);
    }
}
