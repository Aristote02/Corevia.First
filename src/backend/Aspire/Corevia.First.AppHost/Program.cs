var builder = DistributedApplication.CreateBuilder(args);

var pgUsername = builder.AddParameter("pg-username", true);
var pgPassword = builder.AddParameter("pg-password", true);

#if DEBUG
var pgPort = 5432;
#else
int pgPort = 5435;
#endif

var coreviaFirstDb = builder
    .AddPostgres("postgres", pgUsername, pgPassword, port: pgPort)
    .WithPgAdmin()
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .AddDatabase("CoreviaFirstDbConnectionString", "CoreviaFirst");

var redis = builder
    .AddRedis("RedisConnectionString")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var dbMigrator = builder.AddProject<Projects.Corevia_First_MigrationService>("corevia-first-migrator")
    .WithReference(coreviaFirstDb)
    .WaitFor(coreviaFirstDb);

var coreviaFirstApi = builder.AddProject<Projects.Corevia_First_Api>("corevia-first-api")
    .WithReference(coreviaFirstDb)
    .WithReference(redis)
    .WaitFor(dbMigrator)
    .WithEndpoint("http", endpoint =>
    {
        endpoint.Port = 5270;
        endpoint.UriScheme = "http";
    })
    .WithEndpoint("https", endpoint =>
    {
        endpoint.Port = 7220;
        endpoint.UriScheme = "https";
    });

builder.AddNpmApp("corevia-first-web", "../../../frontend/Corevia.First.Web")
    .WithReference(coreviaFirstApi)
    .WithHttpEndpoint(port: 40003, targetPort: 4000, name: "frontend", env: "PORT");

builder.Build().Run();
