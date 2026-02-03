namespace Infrastructure.RickAndMorty.Dtos;


// En esta Clase se define la estructura de la respuesta que contiene una lista de personajes de Rick and Morty
public class RickAndMortyResponseDto
{
    public InfoDto Info { get; set; } = new();
    public List<CharacterDto> Results { get; set; } = new();
}

public class InfoDto
{
    public int Count { get; set; }
    public int Pages { get; set; }
    public string? Next { get; set; }
    public string? Prev { get; set; }
}