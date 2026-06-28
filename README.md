# Innovatech_EFT
Plataforma CI/CD con frontend React, backend Node.js/Express
y base de datos PostgreSQL, desplegada en AWS ECS con GitHub Actions.

## Stack tecnológico
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Contenedores: Docker + Docker Compose
- CI/CD: GitHub Actions
- Cloud: AWS (ECR + ECS Fargate + RDS)

## Cómo ejecutar en local

### Requisitos
- Docker Desktop instalado
- Node.js 18+

### Levantar el entorno completo
```bash
docker-compose up --build
```

### Acceder a la aplicación
- Frontend: http://localhost:5173
- Backend:  http://localhost:3001/health

## Estructura del repositorio
```
innovatech-devops/
├── frontend/        # Aplicación React
├── backend/         # API REST Express
├── db/              # Scripts SQL
└── .github/         # Workflows CI/CD
```