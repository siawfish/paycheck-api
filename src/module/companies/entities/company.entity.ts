import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @ApiProperty({
    example: '620df2a74c7913ebe9afd327',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @ApiProperty({
    example: 'JUST.engineer',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    example: '123456',
  })
  @Column({ nullable: true })
  company_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
