import { Module } from '@nestjs/common';
import { CalibrationModule } from './Calibration/calibration.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [PrismaModule, CalibrationModule, ReadingsModule],
})
export class AppModule {}
