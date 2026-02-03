using Application.Characters;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/characters")]
public class CharactersController : ControllerBase
{
    private readonly GetCharactersService _service;

    public CharactersController(GetCharactersService service)
    {
        _service = service;
    }
    
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Application.Characters.Models.CharacterQuery query)
    {
        if (query.Page <= 0) query.Page = 1;

        var result = await _service.ExecuteAsync(query);
        return Ok(result);
    }
}

