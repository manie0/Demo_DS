#!/bin/sh
set -e

echo 'Aplicando migraciones Prisma...'
npx prisma migrate deploy

echo 'Ejecutando seed Prisma...'
npx ts-node prisma/seed.ts

echo 'Iniciando backend...'
exec node dist/main.js
