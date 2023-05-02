import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimerDto {
  @ApiProperty({ description: 'endTime', required: false })
  endTime: Date;

  userId: string;
}
