import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCalibrationDto {
  @IsOptional()
  @IsNumber()
  sensorOffsetCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  scaleFactor?: number;

  @IsOptional()
  @IsNumber()
  minValidCm?: number;

  @IsOptional()
  @IsNumber()
  maxValidCm?: number;
}
