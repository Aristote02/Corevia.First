using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class DestinationConfiguration : IEntityTypeConfiguration<Destination>
{
    public void Configure(EntityTypeBuilder<Destination> e)
    {
        e.ToTable("destinations");
        e.ConfigureJsonList(d => d.HighlightsFr);
        e.ConfigureJsonList(d => d.HighlightsEn);
        e.ConfigureJsonList(d => d.UniversitiesFr);
        e.ConfigureJsonList(d => d.UniversitiesEn);
        e.ConfigureJsonList(d => d.PopularProgramsFr);
        e.ConfigureJsonList(d => d.PopularProgramsEn);
    }
}
