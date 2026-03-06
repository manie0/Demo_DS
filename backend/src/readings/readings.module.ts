import { Module } from '@nestjs/common';
import { CalibrationModule } from '../calibration/calibration.module';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';

@Module({
  imports: [CalibrationModule],
  controllers: [ReadingsController],
  providers: [ReadingsService],
})
export class ReadingsModule {}
