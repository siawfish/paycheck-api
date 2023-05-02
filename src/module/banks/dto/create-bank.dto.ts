import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({
    example: 'TP Bank',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  bank_name: string;
}
