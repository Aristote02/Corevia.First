using Corevia.First.Domain.Entities;
using Corevia.First.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Corevia.First.Infrastructure.Data.MappingConfiguration;

public sealed class GalleryUniversityConfiguration : IEntityTypeConfiguration<GalleryUniversity>
{
    public void Configure(EntityTypeBuilder<GalleryUniversity> e)
    {
        e.ToTable("gallery_universities");
        e.ConfigureJsonList(g => g.AdmissionRequirementsFr);
        e.ConfigureJsonList(g => g.AdmissionRequirementsEn);
        e.ConfigureJsonList(g => g.FacilitiesFr);
        e.ConfigureJsonList(g => g.FacilitiesEn);
    }
}
