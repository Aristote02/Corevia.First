using Microsoft.Extensions.Options;

namespace Corevia.First.Domain.Options.Validators;

public sealed class SupabaseOptionsValidator : IValidateOptions<SupabaseOptions>
{
    public ValidateOptionsResult Validate(string? name, SupabaseOptions options)
    {
        if (options is null)
            return ValidateOptionsResult.Fail("SupabaseOptions object is null.");

        if (!options.Enabled)
            return ValidateOptionsResult.Success;

        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(options.ProjectUrl))
            errors.Add($"{nameof(options.ProjectUrl)} is required when Supabase auth is enabled.");
        if (string.IsNullOrWhiteSpace(options.AnonKey))
            errors.Add($"{nameof(options.AnonKey)} is required when Supabase auth is enabled.");

        return errors.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(errors);
    }
}
