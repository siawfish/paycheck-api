import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('employments')
export class Employment {
  constructor(partial: Partial<Employment>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Value is a single String of 12 bytes or a string of 24 hex characters',
    example: '6217499149d2c6a17cdc702b',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @ApiProperty({
    description: 'Is String',
    example: 'Employment name',
  })
  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
