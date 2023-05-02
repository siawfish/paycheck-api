import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Bank } from './entities/bank.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}
  async create(createBankDto: CreateBankDto) {
    const bank = this.bankRepository.create(createBankDto);

    bank.bank_no = await this.generateCode();

    return this.bankRepository.save(bank);
  }

  async findAll() {
    return await this.bankRepository.find();
  }

  async findAllBankForAdmin(query: PaginateQuery) {
    const { limit, page, filter } = query;

    const Query = {};

    if (filter?.bank_name) {
      Query['bank_name'] = { $regex: `^${filter.bank_name}` };
    }

    const data = await this.bankRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
      order: { createdAt: 'DESC' },
    });
    const total_page = Math.ceil((await this.bankRepository.count(Query)) / limit);

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  findOne(id: string) {
    return this.bankRepository.findOne({ _id: ObjectId(id) });
  }

  update(id: string, updateBankDto: UpdateBankDto) {
    return this.bankRepository.update(id, updateBankDto);
  }

  async remove(id: string) {
    const check1 = await this.findOne(id);
    if (!check1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `BANK_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.bankRepository.delete(id);

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

  async generateCode() {
    const code = 'B' + String(Math.floor(10000 + Math.random() * 99999));
    const res = await this.bankRepository.findOne({ bank_no: code });

    if (res) {
      this.generateCode();
    }
    return code;
  }
}
