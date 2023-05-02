import { Process, Processor } from '@nestjs/bull';
import { forwardRef, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { LocationService } from 'src/module/location/location.service';
import { TimersService } from 'src/module/timers/timers.service';
import { InfFCM } from '../entities/notifications.entity';
import { NotificationsService } from '../notifications.service';

@Processor('notifications')
export class NotificationsConsumer {
  constructor(
    private readonly notificationService: NotificationsService,
    @Inject(forwardRef(() => TimersService))
    private readonly timersService: TimersService,
    private readonly locationService: LocationService,
  ) {}
  @Process('job')
  async run(job: Job<unknown>) {
    const data: any = job.data;

    const inf: InfFCM = data.fcm;

    //Send FCM to client
    await this.notificationService.sendFCM(inf);

    //Find location
    const location = await this.locationService.findOnyByUserId(data.userId);

    const timer = await this.timersService.findAfter8h(data.userId);

    //Stop time
    await this.timersService.createStopTime(timer._id.toString(), location.latitude, location.longitude);
  }
}
