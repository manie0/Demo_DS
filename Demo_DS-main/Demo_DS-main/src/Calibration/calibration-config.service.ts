// src/calibration/calibration-config.service.ts
import { Injectable } from '@nestjs/common';

export type CalibrationConfig = {
  sensorOffsetCm: number;     // Ajuste de nivel
  scaleFactor: number;        // Factor de escala del sensor
  minValidCm: number;         // Rango válido
  maxValidCm: number;
  updatedAt: Date;
};

@Injectable() // <- En NestJS esto ya es Singleton por defecto
export class CalibrationConfigService {
  private config: CalibrationConfig = {
    sensorOffsetCm: 0,
    scaleFactor: 1,
    minValidCm: 0,
    maxValidCm: 300,
    updatedAt: new Date(),
  };

  get(): CalibrationConfig {
    return this.config;
  }

  update(partial: Partial<Omit<CalibrationConfig, 'updatedAt'>>): CalibrationConfig {
    this.config = {
      ...this.config,
      ...partial,
      updatedAt: new Date(),
    };
    return this.config;
  }

  apply(rawCm: number): number {
    // Convierte lectura cruda usando calibración global
    return (rawCm * this.config.scaleFactor) + this.config.sensorOffsetCm;
  }

  isValid(cm: number): boolean {
    return cm >= this.config.minValidCm && cm <= this.config.maxValidCm;
  }
}