# Módulo Singleton - Lecturas y Alertas de Tanques

Implementación del patrón **Singleton (creacional)** para la configuración/calibración global del sistema, usando **NestJS + Prisma + PostgreSQL**, dockerizado con `docker-compose`.

## Qué cubre este módulo

- **Patrón Singleton:** una sola configuración global (`GlobalTankConfig`) con `id=1`.
- **Prisma ORM:** esquema y migración para PostgreSQL.
- **API REST (NestJS):**
  - `GET /api/singleton/config` → obtiene/crea la config global.
  - `PATCH /api/singleton/config` → actualiza campos de calibración.
  - `POST /api/singleton/config/reset` → reinicia valores por defecto.

## Ejecutar con Docker

```bash
docker compose up --build
```

Servicios:
- API: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432`

## Variables de entorno

Basado en `backend/.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/tanques?schema=public
```

## Ejecutar local sin Docker (opcional)

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```
