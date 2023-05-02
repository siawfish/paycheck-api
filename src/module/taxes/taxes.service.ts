import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxesDTO } from './dto/taxes.dto';
import { TaxesEntity } from './entity/taxes.entity';
@Injectable()
export class TaxesService {
  constructor(
    @InjectRepository(TaxesEntity)
    private taxRepo: Repository<TaxesEntity>,
  ) {}

  async findAllTax() {
    const taxs = await this.taxRepo.find();
    return taxs.map((tax) => {
      return { ...tax, _id: tax._id.toString() };
    });
  }

  async createTax(data: TaxesDTO) {
    const tax = await this.taxRepo.find({ userId: data.userId });
    if (tax.length === 0) {
      const record = this.taxRepo.create(data);
      const result = await this.taxRepo.save({ ...record });
      return { ...result, _id: result._id.toString() };
    } else if (tax.length === 1) {
      return await this.updateByUserId(data.userId, data);
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `BAD_REQUEST`,
          error: `BAD_REQUEST`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateByUserId(userId: string, data: TaxesDTO) {
    const result = await this.taxRepo.findOne({ userId });
    await this.taxRepo.update(result._id.toString(), data);
    const tax = await this.taxRepo.findOne({ userId: userId });
    return { ...tax, _id: tax._id.toString() };
  }

  async findTaxByUserId(userId: string) {
    const tax = await this.taxRepo.findOne({ userId });
    if (tax) {
      return { ...tax, _id: tax._id.toString() };
    }
    return null;
  }

  async removeTax(id: string) {
    return await this.taxRepo.delete(id);
  }
}
