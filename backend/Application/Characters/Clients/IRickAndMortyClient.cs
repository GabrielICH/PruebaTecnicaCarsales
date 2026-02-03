using Application.Episodes.Models;

namespace Application.Characters.Clients;
public interface IRickAndMortyClient
{
    Task<Models.PagedResult<Models.CharacterResult>> GetCharactersAsync(Models.CharacterQuery query);
    Task<Models.PagedResult<EpisodeResult>> GetEpisodesAsync(EpisodeQuery query);
}