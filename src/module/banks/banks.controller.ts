import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Action, AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Bank } from './entities/bank.entity';

@ApiTags('Banks')
@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService, private caslAbilityFactory: CaslAbilityFactory) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(PoliciesGuard)
  @ApiOperation({ summary: 'Create a bank' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Bank))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created', type: Bank })
  create(@Body() createBankDto: CreateBankDto) {
    return this.banksService.create(createBankDto);
  }

  @ApiBearerAuth()
  @Get()
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
    name: 'filter.bank_name',
    explode: true,
    example: 'TP bank',
  })
  @UseGuards(PoliciesGuard)
  @ApiOperation({ summary: 'Get all banks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 201, description: 'Success Created', type: Bank })
  async findAll(@Req() req: any, @Paginate() query: PaginateQuery) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.can(Action.Manage, 'all')) {
      return await this.banksService.findAllBankForAdmin(query);
    }
    return await this.banksService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a bank' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Bank))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: Bank })
  findOne(@Param('id') id: string) {
    return this.banksService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Bank))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: Bank })
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.banksService.update(id, updateBankDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Bank))
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: Bank })
  remove(@Param('id') id: string) {
    return this.banksService.remove(id);
  }
}
