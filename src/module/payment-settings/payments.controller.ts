import { Controller, Get, Patch, Param, Delete, Body, UseGuards, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Response } from 'express';
import * as xlsx from 'xlsx';

@ApiTags('Payments')
@UseGuards(PoliciesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
    name: 'filter.personal_id',
    explode: true,
    example: '053605416',
  })
  @ApiOperation({ summary: `Get all payment` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Payment))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: [Payment] })
  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    const da: Payment = null;
    console.log('🚀 ~ file: payments.controller.ts ~ line 44 ~ PaymentsController ~ da', da);

    return this.paymentsService.findAll(query);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'personal_id',
    required: true,
    description: 'Personal id Isereli',
  })
  @ApiOperation({ summary: `Get a payment by personal id` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Payment))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: Payment })
  @Get(':personal_id/admin')
  findOne(@Param('personal_id') personal_id: string) {
    return this.paymentsService.findByPersonalId(personal_id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: `Update a payment by id` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Payment))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: Payment })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, body);
  }

  // define a route to export all payments as a csv file
  @ApiBearerAuth()
  @ApiOperation({ summary: `Export all payments as a csv file` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Payment))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: Payment })
  @Get('export')
  async export(@Res() res: Response) {
    const data = await this.paymentsService.exportExcel();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data, {
      header: ['ID', 'Personal Id', 'Transaction Date', 'Bank Account Number', 'Bank Branch Code', 'Bank Account Name', 'Invoice'],
      dateNF: 'yyyy-mm-dd',
    });
    xlsx.utils.book_append_sheet(wb, ws, 'Payments');
    xlsx.writeFile(wb, 'payments.xlsx');
    res.download('payments.xlsx');
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: `Delete a payment by id` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Payment))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
