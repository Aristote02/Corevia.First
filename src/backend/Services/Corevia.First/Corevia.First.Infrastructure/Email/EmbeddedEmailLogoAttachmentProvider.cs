using System.Reflection;

namespace Corevia.First.Infrastructure.Email;

internal sealed class EmbeddedEmailLogoAttachmentProvider
{
    private readonly Lazy<byte[]?> _logoBytes;

    public EmbeddedEmailLogoAttachmentProvider() => _logoBytes = new Lazy<byte[]?>(Load);

    public bool HasLogo => _logoBytes.Value is { Length: > 0 };

    public byte[] GetLogoBytes() =>
        _logoBytes.Value ?? throw new InvalidOperationException("Embedded email logo is not available.");

    private static byte[]? Load()
    {
        var assembly = typeof(EmbeddedEmailLogoAttachmentProvider).Assembly;
        var resourceName = assembly
            .GetManifestResourceNames()
            .FirstOrDefault(x => x.EndsWith(EmailLogoConstants.ResourceSuffix, StringComparison.OrdinalIgnoreCase));

        if (resourceName is null)
            return null;

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream is null)
            return null;

        using var memory = new MemoryStream();
        stream.CopyTo(memory);
        return memory.ToArray();
    }
}
