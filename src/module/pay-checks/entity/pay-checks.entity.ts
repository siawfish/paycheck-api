import { ObjectId } from 'mongoose';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('pay_checks')
export class PayChecksEntity {
  constructor(partial: Partial<PayChecksEntity>) {
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
