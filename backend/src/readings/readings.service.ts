import { BadRequestException, Injectable } from '@nestjs/common';
import { CalibrationConfigService } from '../calibration/calibration-config.service';

@Injectable()
export class ReadingsService {
  constructor(private readonly calibration: CalibrationConfigService) {}

  createReading(rawCm: number) {
    const calibrated = this.calibration.apply(rawCm);

    if (!this.calibration.isValid(calibrated)) {
      throw new BadRequestException('Lectura fuera del rango permitido');
    }

    return {
      rawCm,
      calibratedCm: calibrated,
      createdAt: new Date(),
    };
  }
}
