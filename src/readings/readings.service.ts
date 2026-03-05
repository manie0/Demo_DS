import { Injectable, BadRequestException } from '@nestjs/common';
import { CalibrationConfigService } from '../Calibration/calibration-config.service';

@Injectable()
export class ReadingsService {

  constructor(private calibration: CalibrationConfigService) {}

  createReading(rawCm: number) {

    const calibrated = this.calibration.apply(rawCm);

    if (!this.calibration.isValid(calibrated)) {
      throw new BadRequestException('Lectura fuera del rango permitido');
    }

    return {
      rawCm,
      calibratedCm: calibrated,
      createdAt: new Date()
    };
  }
}