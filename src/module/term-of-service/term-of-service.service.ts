import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { TermOfServiceDTO } from './dto/term-of-service.dto';
import { TermOfServiceEntity } from './entity/term-of-service.entity';

@Injectable()
export class TermOfServiceService {
  constructor(
    @InjectRepository(TermOfServiceEntity)
    private readonly termOfServiceRepo: Repository<TermOfServiceEntity>,
  ) {}

  async findAllTermOfService() {
    const termOfServices = await this.termOfServiceRepo.find();
    return termOfServices.map((termOfService) => {
      return { ...termOfService, _id: termOfService._id.toString() };
    });
  }

  async createTermOfService(data: TermOfServiceDTO) {
    const termOfService = this.termOfServiceRepo.create(data);
    return this.termOfServiceRepo.save(termOfService);
  }

  async updateTermOfService(id: string, content: string) {
    const dto = new TermOfServiceDTO();
    dto.content = content;
    await this.termOfServiceRepo.update(id, dto);
    const termOfService = await this.termOfServiceRepo.findOne({ _id: ObjectId(id) });
    return { ...termOfService, _id: termOfService._id.toString() };
  }

  async findTermOfService(Query: any) {
    const termOfService = await this.termOfServiceRepo.findOne(Query);
    return { ...termOfService, _id: termOfService._id.toString() };
  }

  async removeTermOfService(id: string) {
    return this.termOfServiceRepo.delete(id);
  }
}
