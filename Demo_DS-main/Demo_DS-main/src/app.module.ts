import { Module } from '@nestjs/common';
import { CalibrationModule } from './Calibration/calibration.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [
    CalibrationModule,
    ReadingsModule
  ],
})
export class AppModule {}