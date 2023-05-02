import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxesDTO } from './dto/taxes.dto';
import { TaxesService } from './taxes.service';
import { TaxesEntity } from './entity/taxes.entity';
@Controller('taxes')
@ApiTags('Taxes')
export class TaxesController {
  constructor(private taxService: TaxesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all taxes' })
  @ApiResponse({ status: 200, type: TaxesEntity, description: 'OK' })
  @Get()
  async findAll() {
    return this.taxService.findAllTax();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a tax by userId' })
  @ApiResponse({ status: 200, type: TaxesEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.taxService.findTaxByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tax' })
  @ApiBody({ description: 'Tax object that need to added in list', type: TaxesDTO })
  @ApiResponse({ status: 200, type: TaxesEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async create(@Body() taxes: TaxesDTO) {
    return this.taxService.createTax(taxes);
  }
}
