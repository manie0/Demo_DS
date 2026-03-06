import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type CalibrationConfig = {
  id: number;
  sensorOffsetCm: number;
  scaleFactor: number;
  minValidCm: number;
  maxValidCm: number;
  updatedAt: Date;
};

@Injectable()
export class CalibrationConfigService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureConfig(): Promise<CalibrationConfig> {
    const existing = await this.prisma.calibrationConfig.findFirst({
      orderBy: { id: 'asc' },
    });

    if (existing) return existing;

    return this.prisma.calibrationConfig.create({
      data: {
        sensorOffsetCm: 0,
        scaleFactor: 1,
        minValidCm: 0,
        maxValidCm: 300,
      },
    });
  }

  async get(): Promise<CalibrationConfig> {
    return this.ensureConfig();
  }

  async update(
    partial: Partial<Omit<CalibrationConfig, 'id' | 'updatedAt'>>,
  ): Promise<CalibrationConfig> {
    const current = await this.ensureConfig();
    return this.prisma.calibrationConfig.update({
      where: { id: current.id },
      data: partial,
    });
  }

  apply(rawCm: number, config: Pick<CalibrationConfig, 'scaleFactor' | 'sensorOffsetCm'>): number {
    return rawCm * config.scaleFactor + config.sensorOffsetCm;
  }

  isValid(cm: number, config: Pick<CalibrationConfig, 'minValidCm' | 'maxValidCm'>): boolean {
    return cm >= config.minValidCm && cm <= config.maxValidCm;
  }
}
