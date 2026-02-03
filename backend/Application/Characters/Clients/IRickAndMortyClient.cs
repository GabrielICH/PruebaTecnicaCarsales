namespace Application.Characters.Clients;

public interface IRickAndMortyClient
{
    Task<Models.PagedResult<Models.CharacterResult>> GetCharactersAsync(Models.CharacterQuery query);
}