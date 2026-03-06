// src/calibration/calibration.module.ts
import { Global, Module } from '@nestjs/common';
import { CalibrationConfigService } from './calibration-config.service';
import { CalibrationController } from './calibration.controller';

@Global()
@Module({
  providers: [CalibrationConfigService],
  controllers: [CalibrationController],
  exports: [CalibrationConfigService], // otros módulos lo pueden inyectar
})
export class CalibrationModule {}