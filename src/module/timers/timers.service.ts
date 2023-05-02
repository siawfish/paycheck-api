import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { Timer } from './entities/timer.entity';
import { ObjectId } from 'mongodb';
import { WorkStatus } from '../users/entities/users.entity';
import { LocationService } from '../location/location.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { InfFCM, InfNotification, TitleNotification, TypeNotification } from '../notifications/entities/notifications.entity';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class TimersService {
  constructor(
    @InjectRepository(Timer)
    private readonly timerRepository: MongoRepository<Timer>,
    private readonly locationService: LocationService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly fcmService: FcmService,
  ) {}

  async create(userId: string, latitude: string, longitude: string) {
    const createTimerDto = new CreateTimerDto();
    createTimerDto.userId = userId;
    const listTimers = await this.timerRepository.find({ where: { userId: createTimerDto.userId, endTime: null } });
    if (listTimers.length === 0) {
      const timer = this.timerRepository.create(createTimerDto);
      const saveTime = await this.timerRepository.save({ userId: timer.userId, startTime: new Date(), endTime: null, date: new Date() });

      // create location of users when they start timer
      const location = await this.locationService.createLocation(timer._id, latitude, longitude);
      await this.locationService.save({ ...location, timerId: saveTime._id.toString(), userId: userId });

      // update status working of users
      await this.usersService.updateUser(userId, { work_status: WorkStatus.WORKING });

      //Create event send notifications
      await this.getTimeRemaining(saveTime);

      return { ...saveTime, _id: saveTime._id.toString() };
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `INVALID_ENDTIME`,
          error: `BAD_REQUEST`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTimeRemaining(timer: Timer) {
    const totalTime = await this.calculatorTime(timer.userId, timer.date);
    if (totalTime.totalWorkTime <= 28800000) {
      const list_token = await this.fcmService.getListTokens([timer.userId]);

      const fcm: InfFCM = {
        body: 'Your working time in the today is more than 8 hours',
        title: TitleNotification.PERIODIC,
        fcm_token: list_token,
        type: TypeNotification.PERIODIC,
      };

      const infNotifications: InfNotification = {
        timeRemaining: 28802000 - totalTime.totalWorkTime,
        userId: timer.userId,
        fcm: fcm,
      };

      await this.notificationsService.sendNotifications(infNotifications);
      return infNotifications;
    }
    return null;
  }

  async findOne(query: any) {
    const timer = await this.timerRepository.findOne({ where: query });
    return { ...timer, _id: timer._id.toString() };
  }

  async findAll(query: any) {
    return this.timerRepository.find({ where: query });
  }

  async createStopTime(id: string, latitude: string, longitude: string) {
    const body = new UpdateTimerDto();
    body.endTime = new Date();
    const before_check = await this.timerRepository.findOne({ _id: ObjectId(id) });
    if (before_check.endTime) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          message: `TIME_ENDED`,
          error: `OK`,
        },
        HttpStatus.OK,
      );
    }

    await this.timerRepository.update(id, body);
    const createStopTime = await this.timerRepository.findOne({ _id: ObjectId(id) });
    createStopTime._id = createStopTime._id.toString();

    // update status working of users
    await this.usersService.updateUser(createStopTime.userId, { work_status: WorkStatus.NOT_WORKING });

    // create location of user when they stop timer
    const location = await this.locationService.createLocation(id, latitude, longitude);
    await this.locationService.save({ ...location, timerId: createStopTime._id, userId: createStopTime.userId });

    //Remove event send notification
    await this.notificationsService.removeNotifications(createStopTime);

    return createStopTime;
  }

  async createEndOfShift(id: string, latitude: string, longitude: string) {
    const updateTimerDto = new UpdateTimerDto();
    updateTimerDto.endTime = new Date();
    const before_check = await this.timerRepository.findOne({ _id: ObjectId(id) });
    if (before_check.endTime) {
      throw new HttpException(
        {
          statusCode: HttpStatus.OK,
          message: `TIME_ENDED`,
          error: `OK`,
        },
        HttpStatus.OK,
      );
    }
    await this.timerRepository.update(id, updateTimerDto);
    const createEndOfShift = await this.timerRepository.findOne({ _id: ObjectId(id) });

    // update status working users
    await this.usersService.updateUser(createEndOfShift.userId, { work_status: WorkStatus.NOT_WORKING });

    // create location of users when they end of shift
    const location = await this.locationService.createLocation(id, latitude, longitude);
    await this.locationService.save({ ...location, timerId: createEndOfShift._id, userId: createEndOfShift.userId });

    //Remove event send notification
    await this.notificationsService.removeNotifications(createEndOfShift);

    return this.calculatorTime(createEndOfShift.userId, createEndOfShift.date);
  }

  async findAllByUserIdAndDate(userId: string, date: Date) {
    const today = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const tomorrow = new Date(new Date(date).setUTCHours(23, 59, 59, 999));
    tomorrow.setUTCHours(23, 59, 59, 999);
    const listTimerByUserAndDate = await this.timerRepository.find({
      where: {
        userId: userId,
        endTime: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    });
    if (listTimerByUserAndDate.length > 0) {
      listTimerByUserAndDate.forEach((element) => {
        element._id = element._id.toString();
      });
    }
    const timer = await this.timerRepository.findOne({ where: { userId: userId }, order: { _id: -1 } });
    const totalTime = await this.calculatorTime(timer.userId, timer.date);
    let estimatedEndTime = null;
    if (totalTime.totalWorkTime < 28800000) {
      const ts = new Date();
      estimatedEndTime = new Date(ts.getTime() + (28800000 - totalTime.totalWorkTime));
    }

    const createEndOfShift = await this.calculatorTime(userId, date);
    return { ...createEndOfShift, estimatedEndTime: estimatedEndTime };
  }

  async calculatorTime(userId: string, date: Date) {
    let totalWorkTime = null;
    let breakTime = null;
    let overTime = null;
    const today = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const tomorrow = new Date(new Date(date).setUTCHours(23, 59, 59, 999));
    const listTimeByUserAndDate = await this.timerRepository.find({
      where: {
        userId,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    });
    try {
      if (listTimeByUserAndDate) {
        listTimeByUserAndDate.forEach((element) => {
          if (element.endTime === null) {
            element.endTime = new Date();
          }
        });
        const endTimeTemp = new Date(listTimeByUserAndDate[listTimeByUserAndDate.length - 1].endTime);
        const startTimeTemp = new Date(listTimeByUserAndDate[0].startTime);
        const totalTime = endTimeTemp.getTime() - startTimeTemp.getTime() + (new Date().getTime() - endTimeTemp.getTime());
        listTimeByUserAndDate.forEach((element) => {
          totalWorkTime = totalWorkTime + (new Date(element.endTime).getTime() - new Date(element.startTime).getTime());
        });
        breakTime = totalTime - totalWorkTime;
        if (totalWorkTime > 28800000) {
          overTime = totalWorkTime - 28800000;
        } else {
          overTime = 0;
        }
        const stasticsTime = { breakTime, overTime, totalWorkTime, totalTime };
        if (totalWorkTime < 28800000) {
          return stasticsTime;
        } else {
          totalWorkTime = totalWorkTime;
          return { breakTime, overTime, totalWorkTime, totalTime };
        }
      }
    } catch (err) {
      return null;
    }
  }

  async findByMonth(userId: string, date: Date) {
    const updateTimerDto = new UpdateTimerDto();
    updateTimerDto.userId = userId;
    const firstDayOfMonth = new Date(new Date(date.getFullYear(), date.getMonth(), 2).setUTCHours(0, 0, 0, 0));
    const lastDayOfMonth = new Date(new Date(date.getFullYear(), date.getMonth() + 1).setUTCHours(23, 59, 59, 999));

    const listTimer = await this.timerRepository
      .aggregate([
        { $match: { date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, userId: updateTimerDto.userId } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
      ])
      .toArray();
    return listTimer;
  }

  async findCreateTime(req: any) {
    const record = await this.timerRepository.find({ where: { userId: req.user._id, endTime: null } });
    return record;
  }

  async findEndTimeNull(userId: string) {
    const timer = await this.timerRepository.find({ where: { userId: userId, endTime: null } });
    if (timer) {
      const timers = timer.map((result) => {
        return { ...result, _id: result._id.toString() };
      });
      return timers;
    } else {
      return null;
    }
  }

  async findAfter8h(userId: string) {
    return await this.timerRepository.findOne({ where: { userId: userId, endTime: null }, order: { _id: -1 } });
  }
}
