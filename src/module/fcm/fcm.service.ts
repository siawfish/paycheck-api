import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateFcmDto } from './dto/create-fcm.dto';
import { Fcm } from './entities/fcm.entity';
import { ObjectId } from 'mongodb';
import { UsersService } from '../users/users.service';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(Fcm)
    private readonly fcmRepository: MongoRepository<Fcm>,
    private readonly userService: UsersService,
  ) {}

  async create(createDto: CreateFcmDto) {
    const check_before = await this.userService.findOne({ _id: ObjectId(createDto.userId) });
    if (!check_before) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `USER_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const check_exist = await this.fcmRepository.findOne({ where: { fcm_token: { $eq: createDto.fcm_token }, userId: { $eq: createDto.userId } } });
    if (check_exist) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `TOKEN_ALREADY_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const fcm = this.fcmRepository.create(createDto);
    return await this.fcmRepository.save(fcm);
  }

  async remove(id: string) {
    const check_before = await this.fcmRepository.findOne({ where: { _id: ObjectId(id) } });
    if (!check_before) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `TOKEN_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.fcmRepository.delete(id);

    const check_after = await this.fcmRepository.findOne({ where: { _id: ObjectId(id) } });
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

  async getListTokens(user_ids: Array<string>) {
    return await this.fcmRepository.distinct('fcm_token', { userId: { $in: user_ids } });
  }

  async getAllToken() {
    return await this.fcmRepository.distinct('fcm_token', null);
  }
}
