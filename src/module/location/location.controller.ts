import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Location')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
}
