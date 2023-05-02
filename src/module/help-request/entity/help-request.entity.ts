import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('help_requests')
export class HelpRequestEntity {
  constructor(partial: Partial<HelpRequestEntity>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @IsString()
  @IsNotEmpty()
  @Column()
  phonenumber: string;

  @MinLength(5)
  @Column()
  content: string;
}
