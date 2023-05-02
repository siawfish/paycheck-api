import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Timer } from '../timers/entities/timer.entity';
import { NotificationGlobal, NotificationUser } from './dto/notification.dto';
import { InfFCM, InfNotification, TypeNotification } from './entities/notifications.entity';
import { FcmService } from '../fcm/fcm.service';
import { Notification } from './entities/notifications.entity';
import * as accountDev from './config/fcm_config.json';
import * as firebaseAdmin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications')
    private queue: Queue,
    private readonly fcmService: FcmService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createDto: any) {
    const notification = this.notificationRepository.create(createDto);
    return await this.notificationRepository.save(notification);
  }

  async sendNotifications(infNotification: InfNotification) {
    if (infNotification) {
      await this.queue.add('job', infNotification, {
        delay: infNotification.timeRemaining,
        jobId: infNotification.userId,
      });
    }
  }
  async removeNotifications(timer: Timer) {
    // first find the job by Id
    const job = await this.queue.getJob(timer.userId);

    // then remove the job
    await job?.remove();
  }

  async sendNotificationForUser(message: NotificationUser) {
    const list_tokens = await this.fcmService.getListTokens(message.user_ids);

    if (list_tokens.length == 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `NOT_FOUND_TOKEN`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const inf: InfFCM = {
      body: message.body,
      fcm_token: list_tokens,
      type: TypeNotification.PER,
      title: message.title,
    };

    return await this.sendFCM(inf);
  }

  async sendNotificationGlobal(message: NotificationGlobal) {
    const list_tokens = await this.fcmService.getAllToken();
    if (list_tokens.length == 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `NOT_FOUND_TOKEN`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const inf: InfFCM = {
      body: message.body,
      fcm_token: list_tokens,
      type: TypeNotification.GLOBAL,
      title: message.title,
    };

    return await this.sendFCM(inf);
  }

  async sendFCM(inf: InfFCM) {
    const payload = {
      notification: {
        title: inf.title,
        body: inf.body,
        sound: 'default',
        click_action: 'FCM_PLUGIN_ACTIVITY',
        icon: 'fcm_push_icon',
      },
    };

    if (firebaseAdmin.apps.length === 0) {
      const { client_email, project_id, private_key } = accountDev;

      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: project_id,
          clientEmail: client_email,
          privateKey: private_key,
        }),
      });
    }

    const deviceIds = inf.fcm_token;

    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    const optionsSilent = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
      content_available: false,
    };

    try {
      const result = await firebaseAdmin.messaging().sendToDevice(deviceIds, payload, options);

      //Save log
      const saveNotification = { ...inf, ...result };
      const notification = await this.create(saveNotification);

      return notification;
    } catch (error) {
      throw error;
    }
  }
}
