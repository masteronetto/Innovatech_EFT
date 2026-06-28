# Innovatech EFT

Plataforma de integración y entrega continua (CI/CD) desarrollada para el curso Introducción a Herramientas DevOps (ISY1101) en DuocUC. El proyecto automatiza el ciclo completo de build, test, empaquetado y despliegue de una aplicación compuesta por un frontend React, un backend Node.js/Express y una base de datos PostgreSQL, orquestada en AWS ECS Fargate mediante GitHub Actions.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js 18 + Express |
| Base de datos | PostgreSQL 15 |
| Contenedores | Docker + Docker Compose |
| Registro de imágenes | Amazon ECR |
| CI/CD | GitHub Actions |
| Orquestación cloud | AWS ECS Fargate |
| Monitoreo | AWS CloudWatch |
| Gestión de secretos | GitHub Secrets + AWS IAM |

---

## Estructura del repositorio

```
innovatech-devops/
├── frontend/                  # Aplicación React + Vite
│   ├── src/
│   ├── Dockerfile             # Imagen multietapa (Node build → Nginx)
│   └── .dockerignore
├── backend/                   # API REST Node.js + Express
│   ├── index.js
│   ├── Dockerfile             # Imagen multietapa (Node slim)
│   └── .dockerignore
├── db/
│   └── init.sql               # Script de inicialización PostgreSQL
├── .github/
│   └── workflows/
│       └── cicd.yml           # Pipeline CI/CD completo
├── docker-compose.yml         # Orquestación local de desarrollo
└── README.md
```

---

## Cómo ejecutar en local

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/innovatech-devops.git
cd innovatech-devops
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (no se sube a GitHub):

```env
POSTGRES_USER=innovatech
POSTGRES_PASSWORD=innovatech123
POSTGRES_DB=innovatech_db
DATABASE_URL=postgresql://innovatech:innovatech123@db:5432/innovatech_db
PORT=3001
```

### 3. Levantar el entorno completo con Docker Compose

```bash
docker-compose up --build
```

### 4. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend (health check) | http://localhost:3001/health |
| Base de datos | localhost:5432 |

### 5. Detener el entorno

```bash
docker-compose down
```

Para eliminar también los volúmenes (datos de la BD):

```bash
docker-compose down -v
```

---

## Pipeline CI/CD

El pipeline se activa automáticamente en cada push a la rama `main` y ejecuta las siguientes etapas:

```
push a main
    │
    ▼
1. Build ──► Construye las imágenes Docker del frontend y backend
    │
    ▼
2. Test ───► Ejecuta los tests de cada servicio
    │
    ▼
3. Push ───► Publica las imágenes en Amazon ECR con tag git SHA + latest
    │
    ▼
4. Deploy ─► Actualiza los servicios en AWS ECS Fargate
```

### Secrets configurados en GitHub

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Credencial IAM con acceso a ECR y ECS |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta IAM |
| `AWS_REGION` | Región AWS (ej: us-east-1) |
| `ECR_REGISTRY` | URL del registro ECR |

---

## Arquitectura en AWS

```
Internet
    │
    ▼
Application Load Balancer
    │
    ├──► ECS Fargate (Frontend — React/Nginx)
    │
    └──► ECS Fargate (Backend — Node.js)
              │
              ▼
         RDS PostgreSQL
         (subred privada)
```

### Servicios AWS utilizados

- **Amazon ECR** — Registro privado de imágenes Docker
- **Amazon ECS Fargate** — Orquestación de contenedores sin servidor
- **Amazon RDS** — Base de datos PostgreSQL gestionada
- **Amazon VPC** — Red privada con subredes públicas y privadas
- **AWS IAM** — Gestión de permisos con mínimo privilegio
- **AWS CloudWatch** — Logs y métricas del entorno desplegado
- **AWS Secrets Manager** — Gestión segura de credenciales

---

## Buenas prácticas aplicadas

- Dockerfiles multietapa para reducir el tamaño de las imágenes finales
- Imágenes base `slim` y `alpine` para minimizar la superficie de ataque
- Variables de entorno gestionadas con `.env` local y GitHub Secrets en CI/CD
- Principio de mínimo privilegio en roles IAM
- Historial de commits siguiendo la convención [Conventional Commits](https://www.conventionalcommits.org/)
- `.dockerignore` en cada servicio para excluir archivos innecesarios

---

## Integrantes

| Nombre | Rol |
|---|---|
| Nombre Apellido | Desarrollador / DevOps |
| Nombre Apellido | Desarrollador / DevOps |

---