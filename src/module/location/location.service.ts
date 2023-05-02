import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: MongoRepository<Location>,
  ) {}

  async createLocation(id: string, latitude: string, longitude: string) {
    const body = new CreateLocationDto();
    body.latitude = latitude;
    body.longitude = longitude;
    body.date = new Date();
    const save = this.locationRepository.create(body);
    return { ...save };
  }

  async save(body: CreateLocationDto) {
    return this.locationRepository.save(body);
  }

  async findOnyByUserId(userId: string) {
    const location = await this.locationRepository.findOne({ where: { userId: userId }, order: { _id: -1 } });

    return { ...location };
  }
}
