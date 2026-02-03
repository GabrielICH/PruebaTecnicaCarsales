# Prueba Técnica Carsales – Rick & Morty

Repositorio con **Backend (.NET)** y **Frontend (Angular)**.

## Estructura
- `backend/` – API .NET (Clean Architecture: Api / Application / Domain / Infrastructure)
- `frontend/` – Web Angular (Standalone Components + Signals)

## Requisitos
- .NET SDK 8
- Node.js + npm

## Cómo ejecutar

### Backend
```bash
cd backend
dotnet restore
dotnet run --project Api/Api.csproj

### FrontEnd
cd frontend
npm install
npx ng serve