import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmploymentDto {
  @ApiProperty({
    example: 'daasd',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;
}
