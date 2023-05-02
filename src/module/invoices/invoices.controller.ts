import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ObjectId } from 'mongodb';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceEntity } from './entities/invoice.entity';
import { Action, AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from '../users/users.service';

@ApiTags('Invoices')
@UseGuards(PoliciesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoiceService: InvoicesService, private caslAbilityFactory: CaslAbilityFactory, private usersService: UsersService) {}

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
  @ApiOperation({ summary: 'Find all invoice' })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @Get()
  async findAll(@Req() req: any, @Paginate() query: PaginateQuery) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.can(Action.Manage, 'all')) {
      return await this.invoiceService.findAllInvoices(query, null);
    }
    return await this.invoiceService.findAllInvoices(query, { userId: req.user._id });
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
  @ApiOperation({ summary: 'Find all invoice by user' })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @Get(':personal_id/admin')
  async findByUser(@Param('personal_id') personal_id: string, @Paginate() query: PaginateQuery) {
    const user = await this.usersService.findOne({ personal_id: personal_id });
    if (user) {
      return await this.invoiceService.findAllInvoices(query, { userId: user._id });
    } else {
      return [];
    }
  }

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, InvoiceEntity))
  @ApiOperation({ summary: 'Find invoice by id' })
  @ApiParam({ name: 'id', description: 'Id of the invoice to find' })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findInvoice({
      _id: ObjectId(id),
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a invoice' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, InvoiceEntity))
  @ApiBody({ description: 'Invoice object that need to added in list', type: CreateInvoiceDto })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async create(@Body() invoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(invoiceDto);
  }

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, InvoiceEntity))
  @ApiOperation({ summary: 'Update exist invoice' })
  @ApiParam({ name: 'id', description: 'Id of invoice to update' })
  @ApiBody({ description: 'Object body to update', type: CreateInvoiceDto })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() invoiceDto: CreateInvoiceDto) {
    return this.invoiceService.updateInvoice(id, invoiceDto);
  }

  @ApiBearerAuth()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, InvoiceEntity))
  @ApiOperation({ summary: 'Delete a invoice by id' })
  @ApiParam({ name: 'id', description: 'The id of the invoice to delete' })
  @ApiResponse({ status: 200, type: InvoiceEntity, description: 'OK' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.invoiceService.removeInvoice(id);
  }
}
