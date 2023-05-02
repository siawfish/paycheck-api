import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, IsString } from 'class-validator';

export class CreateLogDto {
  @ApiProperty({
    example: '...',
  })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  contents: string;
}
