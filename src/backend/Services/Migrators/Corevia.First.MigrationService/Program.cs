using Corevia.First.Domain.Options;
using Corevia.First.Infrastructure.Data;
using Corevia.First.MigrationService.Services;
using Corevia.First.ServiceDefaults;

var builder = Host.CreateApplicationBuilder(args);

builder.SetupDefaults(args);
builder.Services.AddOptionsWithBaseValidationOnStart<ConnectionStringsOptions>(builder.Configuration, x => x.CoreviaFirstDbConnectionString);
builder.AddDatabase<CoreviaFirstDbContext, ConnectionStringsOptions>(x => x.CoreviaFirstDbConnectionString, "Corevia.First.Infrastructure");

builder.Services.AddHostedService<CoreviaFirstMigrationService>();

var host = builder.Build();
host.Run();
