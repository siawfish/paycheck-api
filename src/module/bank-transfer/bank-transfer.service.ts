import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BankTransferDTO } from './dto/bank-transfer.dto';
import { BankTransferEntity } from './entity/bank-transfer.entity';
import { ObjectId } from 'mongodb';
import { User } from '../users/entities/users.entity';
import { PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class BankTransferService {
  constructor(
    @InjectRepository(BankTransferEntity)
    private bankTransferRepository: MongoRepository<BankTransferEntity>,
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}
  async findAllBankTransfer(query: PaginateQuery, Query: any) {
    const { limit, page } = query;
    const bankTransfers = await this.bankTransferRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
    });
    const count = await this.bankTransferRepository.count(Query);
    const total_page = Math.ceil(count / limit);
    const data = bankTransfers.map((bankTransfer) => {
      return { ...bankTransfer, _id: bankTransfer._id.toString() };
    });
    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  async updateBankTransfer(user: User, updateData: BankTransferDTO) {
    await this.bankTransferRepository.update(user._id, updateData);
    return await this.bankTransferRepository.findOne({ _id: ObjectId(user._id) });
  }

  async updateBankTransferForAdmin(id: string, updateData: any) {
    await this.bankTransferRepository.update(id, updateData);
    return await this.bankTransferRepository.findOne({ _id: ObjectId(id) });
  }

  async createBankTransfer(data: BankTransferDTO) {
    const bankTransfer = this.bankTransferRepository.create(data);

    bankTransfer.bank_transfer_no = await this.generateCode();

    const result = await this.bankTransferRepository.save(bankTransfer);
    return { ...result, _id: result._id.toString() };
  }

  async findBankTransfer(Query: any) {
    const bankTransfer = await this.bankTransferRepository.findOne(Query);
    return { ...bankTransfer, _id: bankTransfer._id.toString() };
  }

  async removeBankTransfer(id: string) {
    return this.bankTransferRepository.delete(id);
  }

  async getAmount(date: Date, req: any) {
    const bankTransferDTO = new BankTransferDTO();
    bankTransferDTO.userId = req.user._id;
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
    firstDayOfMonth.setUTCHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    lastDayOfMonth.setUTCHours(23, 59, 59, 999);
    const totalAmount = await this.bankTransferRepository
      .aggregate([
        { $match: { transferDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, userId: bankTransferDTO.userId } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$transferDate' } }, total_Amount: { $sum: '$amount' } } },
      ])
      .toArray();
    return totalAmount;
  }

  async exportExcel() {
    const bankTransfers = await this.bankTransferRepository.find();
    const data = bankTransfers.map(async (bankTransfer) => {
      const _user = await this.usersRepository.findOne({ _id: bankTransfer.userId });
      return {
        _id: bankTransfer._id.toString(),
        personal_id: _user?.personal_id,
        accountNumber: bankTransfer.accountNumber,
        bankName: bankTransfer.bankName,
        amount: bankTransfer.amount,
        transferDate: bankTransfer.transferDate,
      };
    });
    return data;
  }

  async generateCode() {
    const code = 'PC' + String(Math.floor(10000 + Math.random() * 99999));
    const res = await this.bankTransferRepository.findOne({ bank_transfer_no: code });

    if (res) {
      this.generateCode();
    }
    return code;
  }
}
