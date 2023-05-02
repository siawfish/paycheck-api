import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UsersService } from '../users/users.service';
import { BankTransferService } from './bank-transfer.service';
import { BankTransferDTO } from './dto/bank-transfer.dto';
import { Amount, BankTransferEntity } from './entity/bank-transfer.entity';
import * as xlsx from 'xlsx';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Bank Transfer')
@Controller('bank-transfer')
export class BankTransferController {
  constructor(private bankTransferService: BankTransferService, private caslAbilityFactory: CaslAbilityFactory, private usersService: UsersService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get total amount in the month by userId' })
  @ApiResponse({ status: 200, type: Amount, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiQuery({ name: 'date', example: '2022-03-09' })
  @Get(':monthly/amount')
  async getAmount(@Query('date') date: Date, @Req() req: any) {
    return this.bankTransferService.getAmount(date, req);
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
  @ApiOperation({ summary: 'Find all bank transfer by user' })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
  @Get(':personal_id/admin')
  async findByUser(@Param('personal_id') personal_id: string, @Paginate() query: PaginateQuery) {
    const user = await this.usersService.findOne({ personal_id: personal_id });
    if (user) {
      return await this.bankTransferService.findAllBankTransfer(query, { userId: user._id });
    } else {
      return [];
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all bank transfer', description: 'Return a list of bank transfer' })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
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
  async findAll(@Req() req: any, @Paginate() query: PaginateQuery) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (ability.can(Action.Manage, 'all')) {
      return await this.bankTransferService.findAllBankTransfer(query, null);
    }
    return await this.bankTransferService.findAllBankTransfer(query, { userId: req.user._id });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a bank transfer', description: 'Return a bank transfer was created' })
  @ApiBody({ description: 'Bank transfer object that need to added in list', type: BankTransferDTO })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async create(@Body() bankTransferDTO: BankTransferDTO) {
    return this.bankTransferService.createBankTransfer(bankTransferDTO);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exits bank transfer', description: 'Return a bank transfer was updated' })
  @ApiParam({ name: 'id', description: 'Id of bank transfer to update' })
  @ApiBody({ description: 'Object body to update', type: [BankTransferDTO] })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() bankTransferDTO: BankTransferDTO, @Req() req) {
    return this.bankTransferService.updateBankTransfer(req.user, bankTransferDTO);
  }

  // define a route to export all bank transfers as a csv file
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export all bank transfers as a csv file' })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
  @Get('export')
  async export(@Res() res: Response) {
    const data = await this.bankTransferService.exportExcel();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data, {
      header: ['ID', 'Personal Id', 'Account Number', 'Bank Name', 'Amount', 'Transaction Date'],
      dateNF: 'yyyy-mm-dd',
    });
    xlsx.utils.book_append_sheet(wb, ws, 'Bank-Transfers');
    xlsx.writeFile(wb, 'transfers.xlsx');
    res.download('transfers.xlsx');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a bank transfer' })
  @ApiParam({ name: 'id', description: 'The id of the bank transfer to delete' })
  @ApiResponse({ status: 200, type: BankTransferEntity, description: 'OK' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bankTransferService.removeBankTransfer(id);
  }
}
