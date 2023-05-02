import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { Fcm } from './entities/fcm.entity';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fcm, User])],
  controllers: [FcmController],
  providers: [FcmService, UsersService],
})
export class FcmModule {}
