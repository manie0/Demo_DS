import { Injectable } from '@nestjs/common';

export type CalibrationConfig = {
  sensorOffsetCm: number;
  scaleFactor: number;
  minValidCm: number;
  maxValidCm: number;
  updatedAt: Date;
};

@Injectable()
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
    return rawCm * this.config.scaleFactor + this.config.sensorOffsetCm;
  }

  isValid(cm: number): boolean {
    return cm >= this.config.minValidCm && cm <= this.config.maxValidCm;
  }
}
