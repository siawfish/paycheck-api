import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { ObjectId } from 'mongodb';
import { PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepo: Repository<InvoiceEntity>,
  ) {}

  async findAllInvoices(query: PaginateQuery, Query: any) {
    const { limit, page } = query;

    const invoices = await this.invoiceRepo.find({
      skip: page * limit,
      take: limit,
      where: Query,
    });

    const count = await this.invoiceRepo.count(Query);

    const total_page = Math.ceil(count / limit);

    const data = invoices.map((invoice) => {
      return { ...invoice, _id: invoice._id.toString() };
    });

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  async createInvoice(data: CreateInvoiceDto) {
    const invoice = await this.invoiceRepo.create(data);
    invoice.number = await this.generateCode();
    const result = await this.invoiceRepo.save(invoice);

    return { ...result, _id: result._id.toString() };
  }

  async updateInvoice(id: string, updateData: CreateInvoiceDto) {
    await this.invoiceRepo.update(id, updateData);
    const invoice = await this.invoiceRepo.findOne({ _id: ObjectId(id) });
    return { ...invoice, _id: invoice._id.toString() };
  }

  async updateInvoiceForAdmin(id: string, updateData: any) {
    await this.invoiceRepo.update(id, updateData);
    const invoice = await this.invoiceRepo.findOne({ _id: ObjectId(id) });
    return { ...invoice, _id: invoice._id.toString() };
  }

  async findInvoice(Query: any) {
    const invoice = await this.invoiceRepo.findOne(Query);
    return { ...invoice, _id: invoice._id.toString() };
  }

  async removeInvoice(id: string) {
    return this.invoiceRepo.delete(id);
  }

  async generateCode() {
    const code = Number(Math.floor(100000 + Math.random() * 999999));
    const res = await this.invoiceRepo.findOne({ number: code });

    if (res) {
      this.generateCode();
    }
    return code;
  }
}
