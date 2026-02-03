namespace Infrastructure.RickAndMorty.Dtos;


// En esta Clase se definen las propiedades de un personaje de Rick and Morty
public class CharacterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
}