namespace Corevia.First.Domain.Entities;

public class Faq
{
    public Guid Id { get; set; }

    public string QuestionFr { get; set; } = string.Empty;

    public string QuestionEn { get; set; } = string.Empty;

    public string AnswerFr { get; set; } = string.Empty;

    public string AnswerEn { get; set; } = string.Empty;

    public string Category { get; set; } = "general";

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTimeOffset CreatedAt { get; set; }
}
