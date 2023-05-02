import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IDConstraint } from 'src/validation/basic.validation';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'userId',
    example: '620e0ae39f318b1d4f5246db',
  })
  @Validate(IDConstraint)
  userId: string;

  @ApiProperty({
    description: 'date',
    example: 'dd/MM/yyyy HH:mm:ss',
  })
  date: Date;

  @ApiProperty({
    description: 'file_name',
    example: 'image',
  })
  file_name: string;

  @ApiProperty({
    description: 'file_url',
    example: 'C:/User/paycheck/images',
  })
  file_url: Array<string>;
}
