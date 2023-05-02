import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCompanyFileDto } from './dto/create-company-file.dto';
import { CompanyFile } from './entities/company-file.entity';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyFileService {
  constructor(
    @InjectRepository(CompanyFile)
    private readonly companyFileRepository: Repository<CompanyFile>,
  ) {}

  async create(createDto: CreateCompanyFileDto) {
    const company_file = this.companyFileRepository.create(createDto);
    const saveFile = await this.companyFileRepository.save(company_file);

    return await this.findOne({ _id: ObjectId(saveFile._id) });
  }

  async findOne(query: any): Promise<CompanyFile> {
    const Company = await this.companyFileRepository.findOne({ where: query });
    if (Company) {
      Company._id = Company._id.toString();
      return Company;
    }
    return null;
  }

  async remove(id: string) {
    const check_before = await this.findOne({ _id: ObjectId(id) });
    if (!check_before) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `FILE_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.companyFileRepository.delete(id);

    const check_after = await this.findOne({ _id: ObjectId(id) });
    if (check_after) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `SEVER_ERROR`,
          messageCode: 1600,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { statusCode: 200, message: 'OK' };
  }
}
