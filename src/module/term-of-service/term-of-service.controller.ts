import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TermOfServiceDTO } from './dto/term-of-service.dto';
import { TermOfServiceService } from './term-of-service.service';
import { ObjectId } from 'mongodb';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TermOfServiceEntity } from './entity/term-of-service.entity';
import { Public } from 'src/decorators/public.decorator';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Term of service')
@Controller('term-of-service')
export class TermOfServiceController {
  constructor(private termOfServiceService: TermOfServiceService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Find all term of service' })
  @ApiResponse({ status: 200, type: TermOfServiceEntity, description: 'OK' })
  async findAll() {
    return this.termOfServiceService.findAllTermOfService();
  }

  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a term of service by id' })
  @ApiParam({ name: 'id', description: 'Id of term of service to return' })
  @ApiResponse({ status: 200, type: TermOfServiceEntity, description: 'OK' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.termOfServiceService.findTermOfService({ _id: ObjectId(id) });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a term of service' })
  @ApiBody({ description: 'Term of service object that need to added in list', type: [TermOfServiceDTO] })
  @ApiResponse({ status: 200, type: TermOfServiceEntity, description: 'OK' })
  @ApiResponse({ status: 201, description: 'Record was created' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Post()
  async create(@Body() termOfServiceDto: TermOfServiceDTO) {
    return this.termOfServiceService.createTermOfService(termOfServiceDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update exist term of service' })
  @ApiParam({ name: 'id', description: 'Term of service id to return' })
  @ApiParam({ name: 'content', description: 'Content term of service to update' })
  @ApiResponse({ status: 200, type: TermOfServiceEntity, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Input wrong parameters to API' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @Put(':id/:content')
  async update(@Param('id') id: string, @Param('content') content: string) {
    return this.termOfServiceService.updateTermOfService(id, content);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a term of service' })
  @ApiParam({ name: 'id', description: 'Term of service to delete' })
  @ApiResponse({ status: 200, type: TermOfServiceEntity, description: 'OK' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.termOfServiceService.removeTermOfService(id);
  }
}
