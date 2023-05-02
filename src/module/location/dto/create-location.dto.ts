import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDto {
  userId: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({ example: '123123' })
  latitude: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @ApiProperty({ example: '456456' })
  longitude: string;

  date: Date;

  timerId: string;
}
