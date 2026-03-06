import { Module } from '@nestjs/common';
import { CalibrationController } from './calibration.controller';
import { CalibrationConfigService } from './calibration-config.service';

@Module({
  controllers: [CalibrationController],
  providers: [CalibrationConfigService],
  exports: [CalibrationConfigService],
})
export class CalibrationModule {}
