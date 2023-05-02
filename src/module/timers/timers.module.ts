import { Module } from '@nestjs/common';
import { TimersService } from './timers.service';
import { TimersController } from './timers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timer } from './entities/timer.entity';
import { LocationService } from '../location/location.service';
import { Location } from '../location/entities/location.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { BullModule } from '@nestjs/bull';
import { FcmService } from '../fcm/fcm.service';
import { Notification } from '../notifications/entities/notifications.entity';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Fcm } from '../fcm/entities/fcm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timer, Location, User, Notification, Fcm]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [TimersController],
  providers: [TimersService, LocationService, NotificationsService, UsersService, FcmService, CaslAbilityFactory],
  exports: [LocationService],
})
export class TimersModule {}
