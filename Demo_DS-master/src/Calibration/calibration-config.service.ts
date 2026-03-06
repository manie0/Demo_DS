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
  private static readonly SINGLETON_ID = 1;

  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<CalibrationConfig> {
    return this.ensureSingletonConfig();
  }

  async update(
    partial: Partial<Omit<CalibrationConfig, 'id' | 'updatedAt'>>,
  ): Promise<CalibrationConfig> {
    await this.ensureSingletonConfig();

    return this.prisma.calibrationConfig.update({
      where: { id: CalibrationConfigService.SINGLETON_ID },
      data: partial,
    });
  }

  async apply(rawCm: number): Promise<number> {
    const config = await this.ensureSingletonConfig();
    return rawCm * config.scaleFactor + config.sensorOffsetCm;
  }

  async isValid(cm: number): Promise<boolean> {
    const config = await this.ensureSingletonConfig();
    return cm >= config.minValidCm && cm <= config.maxValidCm;
  }

  private async ensureSingletonConfig(): Promise<CalibrationConfig> {
    return this.prisma.calibrationConfig.upsert({
      where: { id: CalibrationConfigService.SINGLETON_ID },
      update: {},
      create: {
        id: CalibrationConfigService.SINGLETON_ID,
      },
    });
  }
}
