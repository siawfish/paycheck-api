import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { HelpRequestEntity } from './entity/help-request.entity';
import { HelpRequestDTO } from './dto/help-request.dto';
import { PaginateQuery } from 'nestjs-paginate';
@Injectable()
export class HelpRequestService {
  constructor(
    @InjectRepository(HelpRequestEntity)
    private helpReqRepository: Repository<HelpRequestEntity>,
  ) {}

  async findAllReqs(query: PaginateQuery, Query: any) {
    const { limit, page } = query;
    const helpRequests = await this.helpReqRepository.find({
      skip: page * limit,
      take: limit,
      where: Query,
    });

    const count = await this.helpReqRepository.count(Query);

    const total_page = Math.ceil(count / limit);

    const data = helpRequests.map((helpRequest) => {
      return { ...helpRequest, _id: helpRequest._id.toString() };
    });

    return { total_page: total_page, limit: limit, current_page: page, data: data };
  }

  // async findAllByPhonenumber(query: PaginateQuery, phonenumber: string) {
  //   const { limit, page } = query;

  //   const helpRequests = await this.helpReqRepository.find({
  //     skip: page * limit,
  //     take: limit,
  //     where: { phonenumber: phonenumber },
  //   });

  //   const count = await this.helpReqRepository.count({ phonenumber });

  //   const total_page = Math.ceil(count / limit);

  //   const data = helpRequests.map((helpRequest) => {
  //     return { ...helpRequest, _id: helpRequest._id.toString() };
  //   });

  //   return { total_page: total_page, limit: limit, current_page: page, data: data };
  // }

  async updateHelpReq(id: string, updateData: HelpRequestDTO) {
    await this.helpReqRepository.update(id, updateData);
    const helpReq = await this.helpReqRepository.findOne({
      _id: ObjectId(id),
    });
    return { ...helpReq, _id: helpReq._id.toString() };
  }

  async createHelpReq(data: HelpRequestDTO) {
    const helpRequest = this.helpReqRepository.create(data);
    const result = await this.helpReqRepository.save(helpRequest);
    return { ...result, _id: result._id.toString() };
  }

  async findHelpReq(Query: any) {
    const helpRequest = await this.helpReqRepository.findOne(Query);
    return { ...helpRequest, _id: helpRequest._id.toString() };
  }

  async removeHelpReq(id: string) {
    return this.helpReqRepository.delete(id);
  }
}
