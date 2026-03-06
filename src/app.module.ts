import { Module } from '@nestjs/common';
import { CalibrationModule } from './Calibration/calibration.module';
import { ReadingsModule } from './readings/readings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    CalibrationModule,
    ReadingsModule,
  ],
})
export class AppModule {}