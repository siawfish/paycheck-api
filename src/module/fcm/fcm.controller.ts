import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CreateFcmDto } from './dto/create-fcm.dto';
import { FcmService } from './fcm.service';

@ApiTags('FCM Tokens')
@Controller('fcm')
export class FcmController {
  constructor(public readonly fcmService: FcmService) {}

  @Public()
  @ApiOperation({ summary: `Add fcm token when login` })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Post('')
  create(@Body() createDto: CreateFcmDto) {
    return this.fcmService.create(createDto);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @Public()
  @ApiOperation({ summary: `Remove fcm token when logout` })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Delete(':id')
  sendGlobal(@Param('id') id: string) {
    return this.fcmService.remove(id);
  }
}
