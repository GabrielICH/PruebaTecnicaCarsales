using Application.Characters.Clients;
using Application.Characters.Models;
using Application.Episodes.Models;

namespace Application.Episodes;

public class GetEpisodesService
{
    private readonly IRickAndMortyClient _client;

    public GetEpisodesService(IRickAndMortyClient client)
    {
        _client = client;
    }

    public Task<PagedResult<EpisodeResult>> ExecuteAsync(EpisodeQuery query)
        => _client.GetEpisodesAsync(query);
}
