import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayChecksDTO } from './dto/pay-checks.dto';
import { PayChecksEntity } from './entity/pay-checks.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class PayChecksService {
  constructor(
    @InjectRepository(PayChecksEntity)
    public paychecksRepo: Repository<PayChecksEntity>,
  ) {}

  async findAllPayChecks(query: PaginateQuery, Query: any) {
    const { limit, page } = query;
    const paychecks = await this.paychecksRepo.find({
      skip: page * limit,
      take: limit,
      where: Query,
    });
    const count = await this.paychecksRepo.count(Query);
    const total_page = Math.ceil(count / limit);
    const data = paychecks.map((invoice) => {
      return { ...invoice, _id: invoice._id.toString() };
    });
    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }
  async createPayCheck(data: PayChecksDTO) {
    const payCheck = await this.paychecksRepo.create(data);
    const result = await this.paychecksRepo.save(payCheck);
    return { ...result, _id: result._id.toString() };
  }

  async findPayCheck(Query: any) {
    const payCheck = await this.paychecksRepo.findOne(Query);
    return { ...payCheck, _id: payCheck._id.toString() };
  }

  async updatePaycheck(id: string, updateData: PayChecksDTO) {
    await this.paychecksRepo.update(id, updateData);
    const payCheck = await this.paychecksRepo.findOne({ _id: ObjectId(id) });
    return { ...payCheck, _id: payCheck._id.toString() };
  }

  async updatePaycheckForAdmin(id: string, updateData: any) {
    await this.paychecksRepo.update(id, updateData);
    const payCheck = await this.paychecksRepo.findOne({ _id: ObjectId(id) });
    return { ...payCheck, _id: payCheck._id.toString() };
  }

  async removePayCheck(id: string) {
    return this.paychecksRepo.delete(id);
  }
}
