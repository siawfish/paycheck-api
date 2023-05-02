import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'JUST.engineer',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  company_code: string;
}
