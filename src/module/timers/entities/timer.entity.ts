import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('timers')
export class Timer {
  constructor(partial: Partial<Timer>) {
    Object.assign(this, partial);
  }

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
  @ApiProperty({ example: '2022-03-09T08:24:16.060+00:00' })
  endTime: Date;
}

export class StasticsTime {
  @ApiProperty({ example: '123456' })
  breakTime: number;

  @ApiProperty({ example: '123456' })
  overTime: number;

  @ApiProperty({ example: '123456' })
  totalWorkTime: number;

  @ApiProperty({ example: '123456' })
  totalTime: number;
}
