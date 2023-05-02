import { Exclude, Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('fcm')
export class Fcm {
  constructor(partial: Partial<Fcm>) {
    Object.assign(this, partial);
  }

  @Exclude()
  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  fcm_token: string;

  @Expose()
  get id() {
    return this._id.toString();
  }

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
