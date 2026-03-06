import { Body, Controller, Post } from '@nestjs/common';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {

  constructor(private readingsService: ReadingsService) {}

  @Post()
  createReading(@Body() body: { rawCm: number }) {
    return this.readingsService.createReading(body.rawCm);
  }
}