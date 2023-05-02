import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LocationService } from 'src/module/location/location.service';
import { UpdateTimerDto } from 'src/module/timers/dto/update-timer.dto';
import { TimersService } from 'src/module/timers/timers.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly timersService: TimersService, private readonly locationService: LocationService) {}

  @Cron('45 59 21 * * *', {
    name: 'notifications',
    timeZone: 'UTC',
  })

  // @Cron('20 37 07 * * *', {
  //   name: 'notifications',
  //   timeZone: 'UTC',
  // })
  async runEveryDay() {
    this.logger.debug('Reset timer is runing start');
    const lstTimer = await this.timersService.findAll({ endTime: null });
    lstTimer.forEach(async (element) => {
      const updateTimerDto = new UpdateTimerDto();
      updateTimerDto.userId = element.userId;
      const lastLocationOfUser = await this.locationService.findOnyByUserId(element.userId);
      this.timersService.createStopTime(element._id, lastLocationOfUser.latitude, lastLocationOfUser.longitude);
    });
  }
}
