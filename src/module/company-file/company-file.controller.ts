import { Controller, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { CompanyFileService } from './company-file.service';
import { CreateCompanyFileDto } from './dto/create-company-file.dto';
import { CompanyFile } from './entities/company-file.entity';

@ApiTags('Company File')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('company-file')
export class CompanyFileController {
  constructor(private readonly companyFileService: CompanyFileService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create document of company' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, CompanyFile))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created', type: CompanyFile })
  create(@Body() createCompanyFileDto: CreateCompanyFileDto) {
    return this.companyFileService.create(createCompanyFileDto);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete document of company' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, CompanyFile))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  remove(@Param('id') id: string) {
    return this.companyFileService.remove(id);
  }
}
