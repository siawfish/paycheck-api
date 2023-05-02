import { Column, Entity, ObjectIdColumn } from 'typeorm';

// export enum StatusType {
//   start = 'START',
//   end = 'END',
// }

@Entity()
export class Location {
  constructor(partial: Partial<Location>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @Column()
  userId: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  date: Date;

  @Column()
  timerId: string;
}
