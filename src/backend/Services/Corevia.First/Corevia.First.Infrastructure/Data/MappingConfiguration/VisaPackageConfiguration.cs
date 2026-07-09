using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class VisaPackageConfiguration : IEntityTypeConfiguration<VisaPackage>
{
    public void Configure(EntityTypeBuilder<VisaPackage> e)
    {
        e.ToTable("visa_packages");
        e.ConfigureJsonList(v => v.Features);
        e.ConfigureJsonList(v => v.RequiredDocuments);
        e.Property(v => v.Price).HasPrecision(10, 2);
    }
}
