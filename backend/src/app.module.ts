import { Module } from '@nestjs/common';
import { ObserverModule } from './observer/observer.module';
import { CalibrationModule } from './calibration/calibration.module';
import { ReadingsModule } from './readings/readings.module';

/**
 * AppModule raíz de la aplicación.
 *
 * Para integrar con los módulos de los compañeros:
 *   imports: [ObserverModule, SingletonModule, AdapterModule]
 */
@Module({
  imports: [
    // ← Módulo Observer (Grupo 6 – Patrón Observer)
    ObserverModule,
    CalibrationModule,
    ReadingsModule,
  ],
})
export class AppModule {}
