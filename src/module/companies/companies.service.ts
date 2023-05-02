import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companiesRepository.create(createCompanyDto);
    const check_exist = await this.findOne({ company_code: createCompanyDto.company_code });
    if (check_exist) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `COMPANY_CODE_ALREADY_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.companiesRepository.save(company);
  }

  async findAll() {
    return await this.companiesRepository.find();
  }

  async findAllAdmin(query: PaginateQuery) {
    const { limit, page, filter } = query;

    const Query = {};

    if (filter?.name) {
      Query['name'] = { $regex: `^${filter.name}` };
    }

    const data = await this.companiesRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
      order: { createdAt: 'DESC' },
    });

    const count = await this.companiesRepository.count(Query);
    const total_page = Math.ceil(count / limit);

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  async findOne(query: any): Promise<Company> {
    const Company = await this.companiesRepository.findOne({ where: query });
    if (Company) {
      Company._id = Company._id.toString();
      return Company;
    }
    return null;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const check_after = await this.companiesRepository.findOne({ _id: ObjectId(id) });

    if (!check_after) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `COMPANY_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else if (updateCompanyDto.company_code != check_after.company_code) {
      const check_exist = await this.companiesRepository.findOne({ company_code: updateCompanyDto.company_code });
      if (check_exist) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: `COMPANY_CODE_ALREADY_EXIST`,
            messageCode: 1600,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    await this.companiesRepository.update(id, updateCompanyDto);
    return await this.companiesRepository.findOne({ _id: ObjectId(id) });
  }

  async remove(id: string) {
    const check_before = await this.findOne({ _id: ObjectId(id) });
    if (!check_before) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `COMPANY_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.companiesRepository.delete(id);

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
