import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';
import { User, VerifyType } from '../users/entities/users.entity';
import { BanksService } from '../banks/banks.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userrRepository: Repository<User>,
    private readonly bankService: BanksService,
  ) {}

  async create(inf: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(inf);
    return await this.paymentRepository.save(payment);
  }

  async findAll(query: PaginateQuery) {
    const { limit, page, filter } = query;

    const Query = {};

    if (filter?.personal_id) {
      Query['personal_id'] = { $regex: `^${filter.personal_id}` };
    }

    const data = await this.paymentRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
      order: { createdAt: 'DESC' },
    });
    const total_page = Math.ceil((await this.paymentRepository.count(Query)) / limit);

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  async findOne(query: any): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: query });
    if (payment) {
      payment._id = payment._id.toString();

      return payment;
    }
    return null;
  }

  async findByPersonalId(personal_id: string) {
    const user = await this.userrRepository.findOne({ personal_id: personal_id });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `USER_NOT_EXIST`,
          error: 'UNPROCESSABLE_ENTITY',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.findOne({ user_id: user._id });
  }

  async updatePayment(id: string, updatePaymentDto: any) {
    if (updatePaymentDto?.bank_detail?.bank_id) {
      const bank = await this.bankService.findOne(updatePaymentDto.bank_detail.bank_id);
      updatePaymentDto.bank_detail.bank_name = bank.bank_name;
    }
    if (updatePaymentDto?.bank_detail) {
      updatePaymentDto['bank_detail_approval'] = VerifyType.PENDING;
    }
    if (updatePaymentDto?.invoice_name) {
      updatePaymentDto['invoice_name_approval'] = VerifyType.PENDING;
    }

    await this.paymentRepository.update(id, updatePaymentDto);
    return await this.findOne({ _id: ObjectId(id) });
  }

  // get all payments and export as excel
  async exportExcel() {
    const payments = await this.paymentRepository.find({
      order: { createdAt: 'DESC' },
    });

    const data = payments.map((payment) => {
      return {
        _id: payment._id,
        personal_id: payment?.personal_id,
        transaction_id: payment?.createdAt,
        branch_code: payment?.bank_detail?.branch_number,
        account_no: payment?.bank_detail?.account_number,
        account_owner: payment?.bank_detail?.account_owner,
        invoice: payment.invoice_name,
      };
    });
    return data;
  }

  remove(id: string) {
    return this.paymentRepository.delete(id);
  }
}
