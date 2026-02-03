namespace Application.Characters.Models;

public class CharacterQuery
{
  public int Page { get; set; } = 1;  
    public string? Name { get; set; }
    public string? Status { get; set; }
    public string? Species { get; set; }
}
