import { Body, Controller, Get, Put } from '@nestjs/common';
import { CalibrationConfigService } from './calibration-config.service';
import { UpdateCalibrationDto } from './dto/update-calibration.dto';

@Controller('calibration')
export class CalibrationController {
  constructor(private readonly calibration: CalibrationConfigService) {}

  @Get()
  getConfig() {
    return this.calibration.get();
  }

  @Put()
  updateConfig(@Body() dto: UpdateCalibrationDto) {
    return this.calibration.update(dto);
  }
}
