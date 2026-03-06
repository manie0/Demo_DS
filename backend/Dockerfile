# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
# Generar el cliente Prisma y compilar TypeScript
RUN npx prisma generate && npm run build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
# Se copian todos los node_modules del builder (incluye ts-node para el seed)
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
# Schema y seed necesarios en runtime
COPY prisma ./prisma

EXPOSE 3000
