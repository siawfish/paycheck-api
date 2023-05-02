import { Expose, Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }

  @Exclude()
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @Column()
  contents: string;

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
