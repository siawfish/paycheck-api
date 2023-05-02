import { ApiProperty } from '@nestjs/swagger';
import { VerifyType } from 'src/module/users/entities/users.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export class BankDetails {
  account_number: string;
  branch_number: string;
  account_owner: string;
  bank_name: string;
  bank_id: string;
}

export enum FieldNameNoApproval {
  user_id = 'user_id',
  personal_id = 'personal_id',
}

@Entity('payment_settings')
export class Payment {
  constructor(partial: Partial<Payment>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    example: '62112bad325245a5bf9877a8',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @ApiProperty({
    example: 'pending',
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  bank_detail_approval: VerifyType;

  @ApiProperty({
    example: {
      account_number: 'string',
      branch_number: 'string',
      account_owner: 'string',
      bank_name: 'string',
    },
  })
  @Column({ type: 'json' })
  bank_detail: BankDetails;

  @ApiProperty({
    example: 'sasdasdad',
  })
  @Column('string', { nullable: true, default: null })
  invoice_name: string | null;

  @ApiProperty({
    example: 'pending',
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  invoice_name_approval: VerifyType;

  @ApiProperty({
    example: '621621b46edad564d1aee06a',
  })
  @Column()
  user_id: string;

  @ApiProperty({
    example: '0564321',
  })
  @Column()
  personal_id: string;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'array' })
  tax_coordinations_urls: Array<string>;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  tax_coordinations_urls_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'array' })
  social_security_coordinations_urls: Array<string>;
  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  social_security_coordinations_urls_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'array' })
  approval_of_illness_urls: Array<string>;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  approval_of_illness_urls_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'longtext', nullable: true, length: 500 })
  release_papers_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  release_papers_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'longtext', nullable: true, length: 500 })
  disability_approval_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  disability_approval_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'longtext', nullable: true, length: 500 })
  military_work_permit_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  military_work_permit_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ type: 'array' })
  additional_documents_urls: Array<string>;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  additional_documents_urls_approval: VerifyType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
