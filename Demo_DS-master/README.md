# Módulo: Lecturas y Alertas de Tanques (Grupo 6)

Backend NestJS para el patrón **Singleton** usando **Prisma + PostgreSQL**.

## Qué incluye esta parte (Singleton)

- Configuración global de calibración en `CalibrationConfigService`.
- Persistencia con Prisma en una tabla única `CalibrationConfig` (registro fijo `id=1`).
- Endpoints:
  - `GET /calibration` → obtiene configuración global.
  - `PUT /calibration` → actualiza configuración global.
  - `POST /readings` → registra lectura aplicando calibración global.

## Requisitos

- Node.js 20+
- Docker y Docker Compose

## Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

## Ejecutar con Docker (recomendado)

```bash
docker compose up --build
```

Servicios:
- API Nest: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

> El contenedor de API ejecuta `prisma db push` al iniciar para crear/actualizar el esquema.

## Ejecutar local (sin Docker)

1. Levanta PostgreSQL (local o Docker).
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Genera cliente Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Sincroniza esquema:
   ```bash
   npm run prisma:push
   ```
5. Inicia API:
   ```bash
   npm run start:dev
   ```

## Modelo Prisma usado

- `CalibrationConfig` (singleton global)
- `Reading` (lecturas calibradas)
