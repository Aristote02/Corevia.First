# API-only image for Render (frontend hosted separately on Vercel).
# Build context: repository root (.)

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Directory.Packages.props", "."]
COPY ["src/backend/Services/Corevia.First/Corevia.First.Api/Corevia.First.Api.csproj", "src/backend/Services/Corevia.First/Corevia.First.Api/"]
COPY ["src/backend/Services/Corevia.First/Corevia.First.Application/Corevia.First.Application.csproj", "src/backend/Services/Corevia.First/Corevia.First.Application/"]
COPY ["src/backend/Services/Corevia.First/Corevia.First.Domain/Corevia.First.Domain.csproj", "src/backend/Services/Corevia.First/Corevia.First.Domain/"]
COPY ["src/backend/Services/Corevia.First/Corevia.First.Infrastructure/Corevia.First.Infrastructure.csproj", "src/backend/Services/Corevia.First/Corevia.First.Infrastructure/"]
COPY ["src/backend/Aspire/Corevia.First.ServiceDefaults/Corevia.First.ServiceDefaults.csproj", "src/backend/Aspire/Corevia.First.ServiceDefaults/"]

RUN dotnet restore "src/backend/Services/Corevia.First/Corevia.First.Api/Corevia.First.Api.csproj"

COPY . .
WORKDIR "/src/src/backend/Services/Corevia.First/Corevia.First.Api"
RUN dotnet publish "./Corevia.First.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
CMD ["/bin/sh", "-c", "exec dotnet Corevia.First.Api.dll --urls \"http://0.0.0.0:${PORT:-8080}\""]
