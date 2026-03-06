import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService: wrapper de PrismaClient para inyección de dependencias NestJS.
 * Si no existe DATABASE_URL en entorno local, la app sigue iniciando para permitir
 * usar módulos no dependientes de base de datos (p. ej. calibración/lecturas).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  get isConnected(): boolean {
    return this.connected;
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      this.logger.warn('DATABASE_URL no está definido. Endpoints de alertas/setup quedarán deshabilitados.');
      return;
    }

    try {
      await this.$connect();
      this.connected = true;
      this.logger.log('Conexión a base de datos inicializada correctamente.');
    } catch (error) {
      this.logger.error(
        'No fue posible conectar a la base de datos. Alertas/setup quedarán deshabilitados.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async onModuleDestroy() {
    if (!this.connected) return;
    await this.$disconnect();
    this.connected = false;
  }
}
