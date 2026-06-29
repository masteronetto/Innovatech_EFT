# Innovatech EFT

Plataforma de integración y entrega continua (CI/CD) desarrollada para el curso Introducción a Herramientas DevOps (ISY1101) en DuocUC. El proyecto automatiza el ciclo completo de build, test, empaquetado y despliegue de una aplicación compuesta por un frontend React, un backend Node.js/Express y una base de datos PostgreSQL, orquestada en AWS ECS Fargate mediante GitHub Actions.

---
## Integrantes
- Constanza Orellana
- Daniel Onetto
- Corina Roa
- Gabriela Saldivar
---
---
 
## Stack Tecnológico
 
| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js 18 + Express |
| Base de datos | PostgreSQL 15 |
| Contenedores | Docker + Docker Compose |
| Registro de imágenes | Amazon ECR |
| CI/CD | GitHub Actions |
| Orquestación cloud | AWS ECS Fargate |
| Base de datos cloud | Amazon RDS PostgreSQL 15 |
| Red | Amazon VPC |
| Monitoreo | AWS CloudWatch + Container Insights |
| Gestión de secretos | GitHub Secrets + AWS IAM (LabRole) |
 
---
 
## Arquitectura de la Solución
 
```
┌─────────────────────────────────────────────────────────────┐
│                     PIPELINE CI/CD                          │
│                                                             │
│  GitHub Repo → GitHub Actions → Amazon ECR                  │
│                  ├── Build & Test                           │
│                  ├── Build & Push to ECR                    │
│                  └── Deploy to ECS                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ deploy
┌─────────────────────────────────────────────────────────────┐
│              VPC innovatech-vpc (10.0.0.0/16)               │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  Subred pública      │  │  Subred pública             │  │
│  │  us-east-1a          │  │  us-east-1b                 │  │
│  │                      │  │                             │  │
│  │  ECS Fargate         │  │  ECS Fargate                │  │
│  │  Frontend            │  │  Backend                    │  │
│  │  React/Nginx :80     │  │  Node.js/Express :3001      │  │
│  └─────────────────────┘  └──────────────┬──────────────┘  │
│                                           │ SSL :5432       │
│  ┌────────────────────────────────────────▼──────────────┐  │
│  │  Subred privada                                        │  │
│  │  RDS PostgreSQL 15 - innovatech-db                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```
 
---
 
## Estructura del Repositorio
 
```
innovatech-devops/
├── frontend/                        # Aplicación React + Vite
│   ├── src/
│   │   └── App.jsx                  # Componente principal
│   ├── Dockerfile                   # Imagen multietapa Node 20 → Nginx
│   ├── nginx.conf                   # Configuración Nginx
│   └── .dockerignore
├── backend/                         # API REST Node.js + Express
│   ├── index.js                     # Servidor Express con endpoints
│   ├── Dockerfile                   # Imagen multietapa Node 18 slim
│   └── .dockerignore
├── db/
│   └── init.sql                     # Script de inicialización PostgreSQL
├── .github/
│   └── workflows/
│       └── cicd.yml                 # Pipeline CI/CD completo
├── frontend-task-definition.json    # Task definition ECS frontend
├── backend-task-definition.json     # Task definition ECS backend
├── docker-compose.yml               # Orquestación local de desarrollo
└── README.md
```
 
---
 
## Pipeline CI/CD
 
El pipeline se activa automáticamente en cada push a la rama `main` y ejecuta 3 etapas encadenadas:
 
```
push a main
     │
     ▼
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│ Build & Test │────▶│ Build & Push ECR │────▶│ Deploy to ECS  │
│   ~12 seg    │     │    ~29 seg       │     │   ~7 min       │
└─────────────┘     └──────────────────┘     └────────────────┘
 
Duración total: ~8 minutos
```
 
### Etapa 1 — Build and Test
- Instala dependencias del frontend y backend
- Ejecuta los tests del backend (`npm test`)
- Compila el frontend con Vite (`npm run build`)
### Etapa 2 — Build and Push to ECR
- Autentica con AWS usando GitHub Secrets
- Construye imágenes Docker del frontend y backend
- Publica en Amazon ECR con dos tags:
  - `latest` → versión más reciente
  - `{SHA_COMMIT}` → trazabilidad por commit
### Etapa 3 — Deploy to ECS
- Actualiza las task definitions con la nueva imagen
- Despliega en los servicios ECS Fargate
- Espera confirmación de estabilidad del servicio
### GitHub Secrets requeridos
 
| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Credencial de acceso AWS |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta AWS |
| `AWS_SESSION_TOKEN` | Token de sesión temporal |
| `AWS_REGION` | Región AWS (us-east-1) |
| `AWS_ACCOUNT_ID` | ID de cuenta AWS (12 dígitos) |
| `ECR_REGISTRY` | URL del registro ECR |
 
---
 
## Cómo Ejecutar en Local
 
### Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js 20+](https://nodejs.org/)
- [Git](https://git-scm.com/)
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/TU_USUARIO/innovatech-devops.git
cd innovatech-devops
```
 
### 2. Configurar variables de entorno
 
Crea un archivo `.env` en la raíz del proyecto:
 
```env
POSTGRES_USER=innovatech
POSTGRES_PASSWORD=innovatech123
POSTGRES_DB=innovatech_db
DATABASE_URL=postgresql://innovatech:innovatech123@db:5432/innovatech_db
PORT=3001
```
 
### 3. Levantar el entorno completo
 
```bash
docker compose up --build
```
 
### 4. Verificar el funcionamiento
 
| Servicio | URL | Descripción |
|---|---|---|
| Frontend | http://localhost:80 | Aplicación React |
| Backend health | http://localhost:3001/health | Estado del servicio |
| API Productos | http://localhost:3001/api/productos | Listado de productos |
 
### 5. Detener el entorno
 
```bash
docker compose down
```
 
Para eliminar también los datos de la base de datos:
 
```bash
docker compose down -v
```
 
---
 
## URLs de Producción en AWS
 
| Servicio | URL |
|---|---|
| Frontend | http://18.212.78.52 |
| Backend Health | http://13.219.103.86:3001/health |
| API Productos | http://13.219.103.86:3001/api/productos |
 
> **Nota:** Las IPs públicas de los servicios ECS Fargate pueden cambiar al reiniciar las tareas o al recrear el entorno de AWS Academy.
 
---
 
## Infraestructura AWS Desplegada
 
| Recurso | Nombre | Detalle |
|---|---|---|
| VPC | innovatech-vpc | CIDR 10.0.0.0/16 |
| Subredes | innovatech-subnet-public1/2 | us-east-1a y us-east-1b |
| Security Group ECS | innovatech-ecs-sg | Puertos 80 y 3001 |
| Security Group RDS | innovatech-rds-sg | Puerto 5432 (origen: ECS SG) |
| Clúster ECS | innovatech-cluster | Fargate + Container Insights |
| Servicio Frontend | innovatech-frontend-service | 1 tarea Fargate |
| Servicio Backend | innovatech-backend-service | 1 tarea Fargate |
| Base de datos | innovatech-db | RDS PostgreSQL 15, db.t3.micro |
| Registro imágenes | innovatech/frontend | Amazon ECR |
| Registro imágenes | innovatech/backend | Amazon ECR |
| Monitoreo | CloudWatch Logs | /ecs/innovatech-frontend, /ecs/innovatech-backend |
| Región | us-east-1 | Norte de Virginia |
 
---
 
## Buenas Prácticas Aplicadas
 
**Seguridad:**
- Dockerfiles multietapa para reducir la superficie de ataque
- Imágenes base `alpine` y `slim` para minimizar vulnerabilidades
- Usuario no root (`appuser`) en el contenedor del backend
- Security Groups con reglas restrictivas y mínimo privilegio
- Credenciales gestionadas exclusivamente mediante GitHub Secrets
- Conexión SSL a RDS PostgreSQL
**Calidad de código:**
- Commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `ci:`, `docs:`)
- Archivos `.dockerignore` en cada servicio
- Variables de entorno para toda configuración sensible
**Observabilidad:**
- Container Insights habilitado en el clúster ECS
- Logs centralizados en CloudWatch Log Groups
- Métricas de CPU y memoria por servicio y tarea
- Health check endpoint en el backend con verificación de BD
---
 
## Gestión de Ramas
 
| Rama | Propósito |
|---|---|
| `main` | Rama principal — dispara el pipeline CI/CD automáticamente |
| `develop` | Rama de desarrollo activo |
 
---
