using Application.Characters;
using Application.Characters.Clients;
using Infrastructure.RickAndMorty;
using Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<GetCharactersService>();

builder.Services.AddHttpClient<IRickAndMortyClient, RickAndMortyClient>(client =>
{
    client.BaseAddress = new Uri(
        builder.Configuration["RickAndMortyApi:BaseUrl"]!
    );
});


var app = builder.Build();

app.UseSwagger(); // se deja así para no depender de configuraciones de entorno
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Api v1");
    c.RoutePrefix = "swagger";
});


// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.Run();
