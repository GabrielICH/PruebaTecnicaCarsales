# 🚀 Prueba Técnica – Rick & Morty Explorer

Aplicación full-stack desarrollada como solución para la evaluación técnica.

El proyecto está compuesto por:

- Backend API en **.NET**   
- Frontend en **Angular (Standalone + Signals)**
- Integración con la API pública de Rick & Morty

---

##  Arquitectura

### Backend
Estructura basada en separación de capas:

backend/
├── Api
├── Application
├── Domain
└── Infrastructure

Principios aplicados:

- Clean Architecture
- SOLID
- Middleware centralizado de errores
- Configuración por entorno (sin URLs hardcodeadas)

---

### Frontend

Aplicación Angular moderna utilizando:

- Standalone Components
- Signals
- Lazy loading de páginas
- Tipado estricto (sin uso de `any`)
- Componentización desacoplada

Features principales:

- Búsqueda manual de personajes
- Filtros dinámicos
- Paginación controlada
- Manejo visual de errores
- Diseño moderno basado en cards

---

## ⚙️ Requisitos

- .NET SDK 8+
- Node.js 18+
- Angular CLI (opcional)

---

##  Ejecución del Backend

 - cd backend
 - dotnet restore
 - dotnet run --project Api/Api.csproj

##  Ejecución del Frontend

- cd frontend
- npm install
- npx ng serve --proxy-config proxy.conf.json


##  APP

http://localhost:4200

##  SWAGGER
---
- http://localhost:5145/swagger -- Backend
---

