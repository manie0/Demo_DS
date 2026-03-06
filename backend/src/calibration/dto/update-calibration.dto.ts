import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCalibrationDto {
  @IsOptional()
  @IsNumber()
  sensorOffsetCm?: number;

  @IsOptional()
  @IsNumber()
  scaleFactor?: number;

  @IsOptional()
  @IsNumber()
  minValidCm?: number;

  @IsOptional()
  @IsNumber()
  maxValidCm?: number;
}
