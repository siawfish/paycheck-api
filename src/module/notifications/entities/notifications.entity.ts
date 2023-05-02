import { Exclude, Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export enum TypeNotification {
  PERIODIC = 'periodic',
  GLOBAL = 'global',
  PER = 'per',
}

export enum TitleNotification {
  PERIODIC = 'Work time to "OverTime"',
}

export class InfFCM {
  body: string;
  title: string;
  fcm_token: string | Array<string>;
  type: TypeNotification;
}

export class InfNotification {
  timeRemaining: number;
  userId: string;
  fcm: InfFCM;
}

@Entity('notification')
export class Notification {
  @Exclude()
  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  fcm_token: string | Array<string>;

  @Column()
  type: TypeNotification;

  @Column()
  title: TitleNotification;

  @Column()
  body: string;

  @Column()
  results: Array<any>;

  @Column()
  canonicalRegistrationTokenCount: number;

  @Column()
  failureCount: number;

  @Column()
  successCount: number;

  @Column()
  multicastId: number;

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
