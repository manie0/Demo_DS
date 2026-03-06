import { BadRequestException, Injectable } from '@nestjs/common';
import { CalibrationConfigService } from '../Calibration/calibration-config.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingsService {
  constructor(
    private readonly calibration: CalibrationConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async createReading(rawCm: number) {
    const calibrated = await this.calibration.apply(rawCm);
    const valid = await this.calibration.isValid(calibrated);

    if (!valid) {
      throw new BadRequestException('Lectura fuera del rango permitido');
    }

    return this.prisma.reading.create({
      data: {
        rawCm,
        calibratedCm: calibrated,
        isValid: valid,
      },
    });
  }
}
