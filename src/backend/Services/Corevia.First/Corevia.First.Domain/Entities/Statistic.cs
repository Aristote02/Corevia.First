namespace Corevia.First.Domain.Entities;

public class Statistic
{
    public Guid Id { get; set; }

    public string StatKey { get; set; } = string.Empty;

    public string NumberValue { get; set; } = string.Empty;

    public string LabelFr { get; set; } = string.Empty;

    public string LabelEn { get; set; } = string.Empty;

    public string IconName { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
}
