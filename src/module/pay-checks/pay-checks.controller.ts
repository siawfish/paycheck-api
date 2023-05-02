import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayChecksDTO } from './dto/pay-checks.dto';
import { PayChecksService } from './pay-checks.service';
import { ObjectId } from 'mongodb';
import { PayChecksEntity } from './entity/pay-checks.entity';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from '../users/users.service';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Pay checks')
@Controller('pay-checks')
export class PayChecksController {
  constructor(private paycheckService: PayChecksService, private caslAbilityFactory: CaslAbilityFactory, private usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all pay check' })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
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
  @Get()
  async getAllPayChecks(@Req() req: any, @Paginate() query: PaginateQuery) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.can(Action.Manage, 'all')) {
      return await this.paycheckService.findAllPayChecks(query, null);
    }
    return await this.paycheckService.findAllPayChecks(query, { userId: req.user._id });
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all paycheck by user' })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
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
  @Get(':personal_id/admin')
  async findByUser(@Param('personal_id') personal_id: string, @Paginate() query: PaginateQuery) {
    const user = await this.usersService.findOne({ personal_id: personal_id });
    if (user) {
      return await this.paycheckService.findAllPayChecks(query, { userId: user._id });
    } else {
      return [];
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a paycheck by id' })
  @ApiParam({ name: 'id', description: 'Id of paycheck to find' })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id')
  async getPayCheck(@Param('id') id: string) {
    return this.paycheckService.findPayCheck({ _id: ObjectId(id) });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exist paycheck' })
  @ApiParam({ name: 'id', description: 'Id of tax to update' })
  @ApiBody({ description: 'Object body of paycheck to update', type: PayChecksDTO })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() payChecksDto: PayChecksDTO) {
    return this.paycheckService.updatePaycheck(id, payChecksDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a paycheck' })
  @ApiBody({ description: 'Paycheck object that need to added in list', type: PayChecksDTO })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async addPayChecks(@Body() payChecksDto: PayChecksDTO) {
    return this.paycheckService.createPayCheck(payChecksDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a paycheck by id' })
  @ApiParam({ name: 'id', description: 'The id of the paycheck to delete' })
  @ApiResponse({ status: 200, type: PayChecksEntity, description: 'OK' })
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.paycheckService.removePayCheck(id);
  }
}
