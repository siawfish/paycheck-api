import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BullModule } from '@nestjs/bull';
import { NotificationsConsumer } from './consumer/notifications.consumer';
import { FcmService } from '../fcm/fcm.service';
import * as dotenv from 'dotenv';
import { NotificationController } from './notifications.controller';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Notification } from './entities/notifications.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { Fcm } from '../fcm/entities/fcm.entity';
import { TimersService } from '../timers/timers.service';
import { Timer } from '../timers/entities/timer.entity';
import { LocationService } from '../location/location.service';
import { Location } from '../location/entities/location.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Fcm, Notification, Timer, Location]),
    BullModule.forRoot({
      redis: {
        host: process.env.HOST_REDIS,
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationsService, LocationService, NotificationsConsumer, FcmService, CaslAbilityFactory, UsersService, TimersService],
  exports: [NotificationsModule],
})
export class NotificationsModule {}
