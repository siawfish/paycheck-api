import { Module } from '@nestjs/common';
import { SmsOtpService } from './sms-otp.service';
import { SmsOtpController } from './sms-otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsOtp } from './entities/sms-otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmsOtp])],
  controllers: [SmsOtpController],
  providers: [SmsOtpService],
})
export class SmsOtpModule {}
