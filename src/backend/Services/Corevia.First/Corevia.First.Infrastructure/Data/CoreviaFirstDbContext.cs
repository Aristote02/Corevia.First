using ApplicationEntity = Corevia.First.Domain.Entities.Application;
using Corevia.First.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Corevia.First.Infrastructure.Data;

public class CoreviaFirstDbContext : DbContext
{
    public CoreviaFirstDbContext(DbContextOptions<CoreviaFirstDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<ApplicationEntity> Applications => Set<ApplicationEntity>();
    public DbSet<ApplicationHistory> ApplicationHistory => Set<ApplicationHistory>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<AgencyService> Services => Set<AgencyService>();
    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<VisaPackage> VisaPackages => Set<VisaPackage>();
    public DbSet<Statistic> Statistics => Set<Statistic>();
    public DbSet<GalleryUniversity> GalleryUniversities => Set<GalleryUniversity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CoreviaFirstDbContext).Assembly);
    }
}
