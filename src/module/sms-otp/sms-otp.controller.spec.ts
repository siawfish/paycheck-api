import { Test, TestingModule } from '@nestjs/testing';
import { SmsOtpController } from './sms-otp.controller';
import { SmsOtpService } from './sms-otp.service';

describe('SmsOtpController', () => {
  let controller: SmsOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsOtpController],
      providers: [SmsOtpService],
    }).compile();

    controller = module.get<SmsOtpController>(SmsOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
