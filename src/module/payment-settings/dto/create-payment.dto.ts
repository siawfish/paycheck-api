import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { BankDetails } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    example: '621761bbafb8f7900d044bc7',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  user_id: string;
}
