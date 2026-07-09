namespace Corevia.First.Domain.Options;

public class OptionsException : Exception
{
    public OptionsException()
    {
    }

    public OptionsException(string message) : base(message)
    {
    }
}
