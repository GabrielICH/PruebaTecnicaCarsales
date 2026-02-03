using Application.Characters.Clients;
using Application.Characters.Models;

namespace Application.Characters;

public class GetCharactersService
{
    private readonly IRickAndMortyClient _client;

    public GetCharactersService(IRickAndMortyClient client)
    {
        _client = client;
    }

    public Task<PagedResult<CharacterResult>> ExecuteAsync(CharacterQuery query)
        => _client.GetCharactersAsync(query);
}