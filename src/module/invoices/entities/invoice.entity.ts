import { ObjectId } from 'mongoose';
import { ObjectIdColumn, Column, Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('invoices')
export class InvoiceEntity {
  constructor(partial: Partial<InvoiceEntity>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  date: Date;

  @Column()
  file_name: string;

  @Column()
  file_url: Array<string>;

  @Column()
  number: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
