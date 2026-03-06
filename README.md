# Módulo Singleton - Lecturas y Alertas de Tanques

Implementación del patrón **Singleton (creacional)** para la configuración/calibración global del sistema, usando **NestJS + Prisma + PostgreSQL** y una UI en **React**.

## Qué cubre este módulo

- **Patrón Singleton:** una sola configuración global (`GlobalTankConfig`) con `id=1`.
- **Prisma ORM:** esquema y migración para PostgreSQL.
- **API REST (NestJS):**
  - `GET /api/singleton/config` → obtiene/crea la config global.
  - `PATCH /api/singleton/config` → actualiza campos de calibración.
  - `POST /api/singleton/config/reset` → reinicia valores por defecto.
- **Frontend React:** formulario para consultar, editar y resetear la configuración singleton.

## Ejecutar con Docker

```bash
docker compose up --build
```

Servicios:
- Frontend: `http://localhost:4173`
- API: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432`

## Variables de entorno

Backend (ver `backend/.env.example`):

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/tanques?schema=public
```

Frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Si `VITE_API_URL` no está definido, el frontend usa automáticamente `http://<host-actual>:3000/api` para evitar el error típico de `Failed to fetch` cuando no se usa `localhost`.

## Ejecutar local sin Docker (opcional)

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
