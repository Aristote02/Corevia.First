using Corevia.First.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddCoreviaFirst();

var app = builder.Build();

app.MapGet("/healthz", () => Results.Ok("Healthy"));

app.UseCoreviaFirst();

app.Run();
