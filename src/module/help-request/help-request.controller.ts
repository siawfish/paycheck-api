import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelpRequestDTO } from './dto/help-request.dto';
import { HelpRequestService } from './help-request.service';
import { ObjectId } from 'mongodb';
import { Public } from 'src/decorators/public.decorator';
import { HelpRequestEntity } from './entity/help-request.entity';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Help Request')
@Controller('help-request')
export class HelpRequestController {
  constructor(private helpRequestService: HelpRequestService) {}
  // @ApiBearerAuth()
  // @ApiQuery({
  //   required: false,
  //   name: 'limit',
  //   explode: true,
  //   example: 10,
  // })
  // @ApiQuery({
  //   required: false,
  //   name: 'page',
  //   explode: true,
  //   example: 0,
  // })
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, HelpRequestEntity))
  // @ApiOperation({ summary: 'Find all help request', description: 'Return a list of help requests' })
  // @ApiResponse({ status: 200, type: HelpRequestEntity, description: 'OK' })
  // @Get()
  // async findAll(@Paginate() query: PaginateQuery) {
  //   return this.helpRequestService.findAllReqs(query, null);
  // }

  @ApiBearerAuth()
  @ApiQuery({
    required: false,
    name: 'phone_number',
    explode: true,
    example: '0393509856',
  })
  @ApiQuery({
    required: false,
    name: 'limit',
    explode: true,
    example: 10,
  })
  @ApiQuery({
    required: false,
    name: 'page',
    explode: true,
    example: 0,
  })
  @ApiOperation({ summary: 'Find all help request by phone number' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Get('/admin')
  async findAllByUser(@Query('phone_number') phone_number: string, @Paginate() query: PaginateQuery) {
    if (phone_number) {
      return this.helpRequestService.findAllReqs(query, { phonenumber: phone_number });
    } else {
      return this.helpRequestService.findAllReqs(query, null);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a help request by id', description: 'Return a help request' })
  @ApiParam({ name: 'id', description: 'Id of the tax to find' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, HelpRequestEntity))
  @ApiResponse({ status: 200, type: HelpRequestEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.helpRequestService.findHelpReq({ _id: ObjectId(id) });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exist help request ', description: 'Return a help request was updated' })
  @ApiParam({ name: 'id', description: 'Id of tax to update' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, HelpRequestEntity))
  @ApiBody({ description: 'Object body to update', type: HelpRequestDTO })
  @ApiResponse({ status: 200, type: HelpRequestEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() helpRequestDto: HelpRequestDTO) {
    return this.helpRequestService.updateHelpReq(id, helpRequestDto);
  }

  @Public()
  @ApiOperation({ summary: 'Create a help request', description: 'Return a help request was created' })
  @ApiBody({ description: 'Tax object that need to added in list', type: HelpRequestDTO })
  @ApiResponse({ status: 200, type: HelpRequestEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async create(@Body() helpRequestDto: HelpRequestDTO) {
    return this.helpRequestService.createHelpReq(helpRequestDto);
  }

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, HelpRequestEntity))
  @ApiOperation({ summary: 'Delete a help request by id' })
  @ApiParam({ name: 'id', description: 'The id of the tax to delete' })
  @ApiResponse({ status: 200, type: HelpRequestEntity, description: 'OK' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.helpRequestService.removeHelpReq(id);
  }
}
