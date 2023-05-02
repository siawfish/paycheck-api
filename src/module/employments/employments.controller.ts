import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmploymentsService } from './employments.service';
import { CreateEmploymentDto } from './dto/create-employment.dto';
import { UpdateEmploymentDto } from './dto/update-employment.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { Employment } from './entities/employment.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Employments')
@Controller('employments')
export class EmploymentsController {
  constructor(private readonly employmentsService: EmploymentsService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(PoliciesGuard)
  @ApiOperation({ summary: 'Create an employment' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Employment))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created', type: Employment })
  create(@Body() createEmploymentDto: CreateEmploymentDto) {
    return this.employmentsService.create(createEmploymentDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all employments' })
  @ApiResponse({ status: 200, description: 'OK', type: [Employment] })
  findAll() {
    return this.employmentsService.findAll();
  }

  @ApiBearerAuth()
  @Get('admin')
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
  @ApiQuery({
    required: false,
    name: 'filter.name',
    explode: true,
    example: 'Demo',
  })
  @ApiOperation({ summary: 'Get all employments for admin' })
  @ApiResponse({ status: 200, description: 'OK', type: [Employment] })
  findAllForAdmin(@Paginate() query: PaginateQuery) {
    return this.employmentsService.findAllForAdmin(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get an employment by id' })
  @ApiResponse({ status: 200, description: 'OK', type: Employment })
  findOne(@Param('id') id: string) {
    return this.employmentsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @ApiOperation({ summary: 'Change an employment by id' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Employment))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: Employment })
  update(@Param('id') id: string, @Body() updateEmploymentDto: UpdateEmploymentDto) {
    return this.employmentsService.update(id, updateEmploymentDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @ApiOperation({ summary: 'Delete an employment by id' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Employment))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('id') id: string) {
    return this.employmentsService.remove(id);
  }
}
