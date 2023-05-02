import { ApiProperty } from '@nestjs/swagger';
import { Column, ObjectIdColumn } from 'typeorm';
// import { Column } from 'typeorm';
export class CreateTimerDto {
  @ApiProperty({ example: '6228639df98aab33bc6cae8e' })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @Column()
  @ApiProperty({ example: '2022-03-09T08:21:49.151Z' })
  date: Date;

  @Column()
  @ApiProperty({ example: '621dcc898f52c42a10ba63e6' })
  userId: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: '2022-03-09T08:21:49.151Z' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ example: null })
  endTime: Date;
}
