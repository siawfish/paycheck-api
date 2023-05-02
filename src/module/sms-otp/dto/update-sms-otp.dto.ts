import { PartialType } from '@nestjs/swagger';
import { CreateSmsOtpDto } from './create-sms-otp.dto';

export class UpdateSmsOtpDto extends PartialType(CreateSmsOtpDto) {}
