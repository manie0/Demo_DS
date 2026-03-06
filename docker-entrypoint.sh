#!/bin/sh
set -e

echo 'Aplicando migraciones Prisma (src)...'
npx prisma migrate deploy

echo 'Iniciando API src...'
exec node dist/main.js
