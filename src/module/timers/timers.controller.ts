import { Controller, Get, Post, Param, ClassSerializerInterceptor, UseInterceptors, Req, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { TimersService } from './timers.service';
import { CreateTimerDto } from './dto/create-timer.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StasticsTime, Timer } from './entities/timer.entity';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { WorkStatus } from '../users/entities/users.entity';

@ApiTags('Timer')
@UseGuards(PoliciesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('timers')
export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create timer' })
  @ApiResponse({ status: 201, description: 'Record was created', type: CreateTimerDto })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  create(@Req() req: any, @Query('latitude') latitude: string, @Query('longitude') longitude: string) {
    if (req.user.work_status == WorkStatus.BLOCKED) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `USER_IS_BLOCKED`,
        messageCode: 1600,
      };
    }

    return this.timersService.create(req.user._id, latitude, longitude);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create stop timer' })
  @ApiResponse({ status: 200, type: Timer, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id/stop')
  createStopTime(@Query('id') id: string, @Req() req: any, @Query('latitude') latitude: string, @Query('longitude') longitude: string) {
    if (req.user.work_status == WorkStatus.BLOCKED) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `USER_IS_BLOCKED`,
        messageCode: 1600,
      };
    }
    return this.timersService.createStopTime(id, latitude, longitude);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End of shift and return statistics' })
  @ApiResponse({ status: 200, description: 'OK', type: StasticsTime })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id/end-of-shift')
  createEndOfShift(@Param('id') id: string, @Req() req: any, @Query('latitude') latitude: string, @Query('longitude') longitude: string) {
    if (req.user.work_status == WorkStatus.BLOCKED) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        message: `USER_IS_BLOCKED`,
        messageCode: 1600,
      };
    }
    return this.timersService.createEndOfShift(id, latitude, longitude);
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'date', example: '2022-03-08' })
  @ApiOperation({ summary: 'Get total stastics timer of user by date' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get('date')
  findAllByUserIdAndDate(@Req() req: any, @Query('date') date: Date) {
    return this.timersService.findAllByUserIdAndDate(req.user._id, date);
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'date', example: '2022-03-08' })
  @ApiOperation({ summary: 'Get all workday of user in the month' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get('month')
  findByMonth(@Req() req: any, @Query('date') date: Date) {
    return this.timersService.findByMonth(req.user._id, date);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find timer of user by endtime' })
  @ApiResponse({ status: 200, description: 'OK', type: CreateTimerDto })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get()
  findByEndTime(@Req() req: any) {
    return this.timersService.findEndTimeNull(req.user._id);
  }
}
