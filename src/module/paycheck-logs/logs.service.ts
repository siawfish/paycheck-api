import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { Log } from './entities/log.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  create(createLogDto: CreateLogDto) {
    const create = this.logsRepository.create(createLogDto);
    return this.logsRepository.save(create);
  }

  findAll() {
    return this.logsRepository.find();
  }

  findOne(id: string) {
    return this.logsRepository.findOne({ _id: ObjectId(id) });
  }

  async remove() {
    await this.logsRepository.delete({});

    const check2 = await this.logsRepository.findOne();
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
