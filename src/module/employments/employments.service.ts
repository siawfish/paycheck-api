import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmploymentDto } from './dto/create-employment.dto';
import { UpdateEmploymentDto } from './dto/update-employment.dto';
import { Employment } from './entities/employment.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class EmploymentsService {
  constructor(
    @InjectRepository(Employment)
    private readonly employmentRepository: Repository<Employment>,
  ) {}
  create(createEmploymentDto: CreateEmploymentDto) {
    return this.employmentRepository.save(createEmploymentDto);
  }

  async findAll() {
    return await this.employmentRepository.find();
  }

  async findAllForAdmin(query: PaginateQuery) {
    const { limit, page, filter } = query;

    const Query = {};

    if (filter?.name) {
      Query['name'] = { $regex: `^${filter.name}` };
    }

    const data = await this.employmentRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
      order: { createdAt: 'DESC' },
    });
    const total_page = Math.ceil((await this.employmentRepository.count(Query)) / limit);

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  findOne(id: string) {
    return this.employmentRepository.findOne({ _id: ObjectId(id) });
  }

  update(id: string, updateEmploymentDto: UpdateEmploymentDto) {
    return this.employmentRepository.update(id, updateEmploymentDto);
  }

  async remove(id: string) {
    const check1 = await this.findOne(id);
    if (!check1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `EMPLOYMENT_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.employmentRepository.delete(id);

    const check2 = await this.findOne(id);
    if (check2) {
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
