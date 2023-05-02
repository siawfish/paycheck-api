import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

export class ResponseForgotPassword {
  @ApiProperty({
    example: '6217499149d2c6a17cdc702b',
  })
  userId: string;
}
@Entity('sms_otp')
export class SmsOtp {
  @ApiProperty({
    example: '6217499149d2c6a17cdc702b',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @Exclude()
  @Column({ type: 'long' })
  expires: number;

  @ApiProperty({
    example: '6217499149d2c6a17cdc702b',
  })
  @Column()
  userId: string;

  @Exclude()
  @Column({ type: 'longtext', length: 500 })
  hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}

export class ResponseVerifyOtp {
  @ApiProperty({
    description: 'Bear token for change password',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAanVzdC5lbmdpbmVlci5jb20iLCJwaG9uZV9udW1iZXIiOiI5NjQ4MTYyMDYiLCJfaWQiOiI2MjE3NjFiYmFmYjhmNzkwMGQwNDRiYzciLCJzdWIiOiI2MjE3NjFiYmFmYjhmNzkwMGQwNDRiYzciLCJpYXQiOjE2NDU3NzgxOTgsImV4cCI6MTY3NzMxNDE5OH0.TVtwpu7PZ-4z_TI6FwB0NRxJsCFEX9DfyO-olQa7eBg',
  })
  accessToken: string;
}
