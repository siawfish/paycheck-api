import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Logs')
@Controller('logs')
@Public()
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created' })
  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created' })
  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Delete()
  remove() {
    return this.logsService.remove();
  }
}
