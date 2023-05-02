import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ObjectId } from 'mongodb';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Company } from './entities/company.entity';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a company' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Company))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created', type: Company })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all companies' })
  @ApiResponse({ status: 200, description: 'OK', type: [Company] })
  @Public()
  findAll() {
    return this.companiesService.findAll();
  }

  @ApiBearerAuth()
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
    example: '053605416',
  })
  @Get('/admin')
  @ApiOperation({ summary: 'Find all companies for admin' })
  @ApiResponse({ status: 200, description: 'OK', type: [Company] })
  findAllForAdmin(@Paginate() query: PaginateQuery) {
    return this.companiesService.findAllAdmin(query);
  }

  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Find a company by id' })
  @ApiResponse({ status: 200, description: 'OK', type: Company })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne({ _id: ObjectId(id) });
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: 'Change a company by id' })
  @Patch(':id')
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: Company })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Company))
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a company by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Company))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
