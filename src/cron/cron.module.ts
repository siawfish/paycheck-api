import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fcm } from 'src/module/fcm/entities/fcm.entity';
import { FcmService } from 'src/module/fcm/fcm.service';
import { NotificationsService } from 'src/module/notifications/notifications.service';
import { Timer } from 'src/module/timers/entities/timer.entity';
import { TimersModule } from 'src/module/timers/timers.module';
import { TimersService } from 'src/module/timers/timers.service';
import { User } from 'src/module/users/entities/users.entity';
import { UsersService } from 'src/module/users/users.service';
import { Notification } from 'src/module/notifications/entities/notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timer, User, Fcm, Notification]),
    TimersModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [],
  providers: [TimersService, NotificationsService, UsersService, FcmService],
  exports: [TimersService],
})
export class CronModule {}
