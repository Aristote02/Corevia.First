using Microsoft.Extensions.Options;

namespace Corevia.First.Domain.Options.Validators;

public sealed class EmailNotificationOptionsValidator : IValidateOptions<EmailNotificationOptions>
{
    public ValidateOptionsResult Validate(string? name, EmailNotificationOptions options)
    {
        if (options is null)
            return ValidateOptionsResult.Fail("EmailNotificationOptions object is null.");

        if (!options.Enabled)
            return ValidateOptionsResult.Success;

        var errors = new List<string>();
        ValidateRequired(options.SendGridApiKey, nameof(options.SendGridApiKey), errors);
        ValidateRequired(options.SenderEmail, nameof(options.SenderEmail), errors);
        ValidateRequired(options.SenderName, nameof(options.SenderName), errors);
        ValidateRequired(options.FrontendBaseUrl, nameof(options.FrontendBaseUrl), errors);
        ValidateRequired(options.ResetPasswordPath, nameof(options.ResetPasswordPath), errors);
        ValidateRequired(options.PasswordResetSubject, nameof(options.PasswordResetSubject), errors);
        ValidateRequired(options.PasswordChangedSubject, nameof(options.PasswordChangedSubject), errors);
        ValidateRequired(options.WelcomeSubject, nameof(options.WelcomeSubject), errors);

        return errors.Count == 0
            ? ValidateOptionsResult.Success
            : ValidateOptionsResult.Fail(errors);
    }

    private static void ValidateRequired(string? value, string propertyName, List<string> errors)
    {
        if (string.IsNullOrWhiteSpace(value))
            errors.Add($"{propertyName} is required when email notifications are enabled.");
    }
}
