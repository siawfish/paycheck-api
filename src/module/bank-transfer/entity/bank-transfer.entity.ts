import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('bank_transfers')
export class BankTransferEntity {
  constructor(partial: Partial<BankTransferEntity>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  accountNumber: string;

  @Column()
  branchNumber: string;

  @Column()
  bank_transfer_no: string;

  @Column()
  bankName: string;

  @Column()
  amount: number;

  @Column()
  invoiceFileUrl: Array<string>;

  @Column()
  transferDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}

export class Amount {
  @ApiProperty({ example: '2022-03' })
  _id: Date;

  @ApiProperty({ example: '9999' })
  total_Amount: number;
}
