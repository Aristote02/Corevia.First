# Corevia First

Travel agency platform built with **Clean Architecture**, **Vertical Slice** API design, and **.NET Aspire** for local orchestration.

The React frontend (Vite SPA + TanStack Router) calls this backend via REST. JSON responses use **snake_case** to match the frontend types.

## Solution structure

```
Corevia.First/
├── Corevia.First.sln
├── Directory.Packages.props
├── compose.yml
└── src/
    ├── backend/
    │   ├── Aspire/
    │   │   ├── Corevia.First.AppHost/          # Local orchestration (Postgres, Redis, API, migrator)
    │   │   └── Corevia.First.ServiceDefaults/  # OTel, Serilog, health, DB helper
    │   └── Services/
    │       ├── Corevia.First/
    │       │   ├── Corevia.First.Domain/       # Entities, enums, options (no infra deps)
    │       │   ├── Corevia.First.Application/  # Use-case services, DTOs, repository interfaces
    │       │   ├── Corevia.First.Infrastructure/ # EF Core, external integrations
    │       │   └── Corevia.First.Api/          # FastEndpoints vertical slices
    │       └── Migrators/
    │           └── Corevia.First.MigrationService/
    ├── frontend/
    │   └── Corevia.First.Web/                  # React + Vite SPA
    └── tests/
        └── UnitTests/
            └── Corevia.First.UnitTests/        # Domain + application unit tests
```

## Implemented API modules

| Area | Endpoints | Notes |
|------|-----------|-------|
| Auth | `POST /api/auth/sign-in`, `sign-up`, `refresh`, `sign-out`, `forgot-password`, `reset-password`, `GET /api/auth/config`, `POST /api/auth/supabase/sync` | JWT + refresh tokens; optional Supabase OAuth |
| Profile | `GET/PUT /api/profile` | Current authenticated user profile |
| Applications | `POST /api/applications/submit`, `GET /api/applications/mine` | Contact form + user dossiers |
| Admin applications | `GET/PATCH/DELETE /api/admin/applications/*` | Status workflow + history |
| Contacts | `POST /api/contacts/submit`, admin CRUD | Admin messages inbox |
| Testimonials | public list + submit; admin moderation | |
| Catalog | `GET /api/destinations`, `services`, `faqs`, `visa-packages`, `statistics`, `gallery-universities` | Read-only |
| Admin users | `GET /api/admin/users`, super-admin update/delete | |
| Overview | `GET /api/admin/overview` | Dashboard stats |

Dev admin seed (when `AdminSeed:Enabled` is true in Development): see `appsettings.Development.json` or user secrets — credentials are not stored in the base `appsettings.json`.

## Authentication (dual mode)

The platform supports **config-driven** authentication. Both paths can coexist (`hybrid`).

### Path 1 — Custom backend auth (default)

Email/password sign-in, JWT + refresh tokens, users stored in Postgres.

1. Set `Email:Enabled=true` and SendGrid settings via user secrets or environment variables
2. Frontend: `VITE_AUTH_MODE=custom` (default) or `hybrid`
3. Forgot/reset flows call `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`
4. In development, reset tokens are logged to the API console when email is disabled

### Path 2 — Supabase Auth

OAuth (Google) and Supabase-managed password reset emails. Backend validates Supabase JWTs and upserts local users.

1. Enable in API: `Supabase:Enabled=true`, `ProjectUrl`, `AnonKey`
2. Configure OAuth providers in the Supabase dashboard
3. Frontend: `VITE_AUTH_MODE=supabase` or `hybrid` (or rely on `GET /api/auth/config`)
4. After OAuth sign-in, the SPA calls `POST /api/auth/supabase/sync`

| `VITE_AUTH_MODE` | Email/password | Google OAuth |
|------------------|----------------|--------------|
| `custom` (default) | Custom API | Hidden |
| `supabase` | Supabase | Supabase |
| `hybrid` | Custom API | Supabase |

## Domain modules

| Module | Entity | API |
|--------|--------|-----|
| Applications | `Application` | Submit, list mine, admin CRUD + status workflow |
| Application history | `ApplicationHistory` | Audit trail per application |
| Contacts | `Contact` | Public submit + admin inbox |
| Users | `User` | Auth, profile, admin user management |
| Destinations | `Destination` | Public catalog |
| Services | `AgencyService` | Public catalog |
| Visa packages | `VisaPackage` | Public catalog |
| Testimonials | `Testimonial` | Public list + submit; admin moderation |
| FAQs | `Faq` | Public catalog |
| Gallery | `GalleryUniversity` | Public catalog |
| Statistics | `Statistic` | Landing page stats |

## Run tests

```bash
dotnet test src/tests/UnitTests/Corevia.First.UnitTests/Corevia.First.UnitTests.csproj
```

Uses **xUnit**, **FluentAssertions**, **AutoFixture**, and **NSubstitute**. Tests follow **Arrange-Act-Assert** and cover domain validators, mapping, security helpers, and application services.

## Run locally (Aspire)

```bash
dotnet run --project src/backend/Aspire/Corevia.First.AppHost
```

- API HTTP: `http://localhost:5270`
- API HTTPS: `https://localhost:7220`
- Frontend (Vite): `http://localhost:40003`
- Swagger (dev): `/swagger`

Startup order: **Postgres → MigrationService → API**

## Frontend only

```bash
cd src/frontend/Corevia.First.Web
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5270`. In production the SPA is deployed separately (Vercel).

## Run API only

```bash
dotnet run --project src/backend/Services/Corevia.First/Corevia.First.Api
```

Requires Postgres and Redis connection strings in `appsettings.json` or user secrets.

## Docker Compose

```bash
docker compose up -d postgres redis
dotnet run --project src/backend/Services/Corevia.First/Corevia.First.Api
```

Postgres: `localhost:5433` · Redis: `localhost:6380`

## Production (overview)

| Layer | Host |
|-------|------|
| API + Redis | Render |
| Postgres + Auth | Supabase |
| Frontend | Vercel |

Infra scaffolding: `render.yaml`, `.github/workflows/production-database-migrations.yml`.

**Detailed runbook:** maintain locally as `DEPLOYMENT.local.md` (gitignored — not pushed to GitHub).

Never commit connection strings, API keys, or passwords. Use platform env vars (Render, GitHub Secrets, Vercel, Supabase).

## Adding features

1. **Domain** — add entities/enums under `Corevia.First.Domain`
2. **Application** — add service interfaces + implementations, DTOs, register in `ApplicationDependencies.cs`
3. **Infrastructure** — EF configuration, repositories, migrations; register in `DependencyInjection.cs` and `RepositoriesConfiguration.cs`
4. **Api** — add vertical slice under `Features/{Area}/{UseCase}/`

## Architecture patterns

- **Clean Architecture** — inward dependencies only
- **Vertical Slice** — one folder per endpoint (FastEndpoints)
- **Repository** — interfaces in Application, EF impl in Infrastructure
- **Migrations** — separate one-shot worker, not in API startup
