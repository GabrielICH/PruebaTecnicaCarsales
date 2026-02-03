namespace Infrastructure.RickAndMorty.Dtos;

public class RickAndMortyEpisodeResponseDto
{
    public InfoDto Info { get; set; } = new();
    public List<EpisodeDto> Results { get; set; } = new();
}
