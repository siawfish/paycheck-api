import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('company_files')
export class CompanyFile {
  @ApiProperty({
    example: '620df2a74c7913ebe9afd327',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @ApiProperty({
    example: '620df2a74c7913ebe9afd327',
  })
  @Column()
  company_id: string;

  @ApiProperty({
    example: '',
  })
  @Column()
  file_name: string;

  @ApiProperty({
    example: null,
  })
  @Column({ nullable: true, type: 'longtext', length: 500 })
  file_url: Array<string>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
