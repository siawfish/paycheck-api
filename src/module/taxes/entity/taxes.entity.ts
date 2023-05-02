import { ObjectId } from 'mongoose';
import { ObjectIdColumn, Column, Entity } from 'typeorm';

@Entity('taxes')
export class TaxesEntity {
  constructor(partial: Partial<TaxesEntity>) {
    Object.assign(this, partial);
  }

  @ObjectIdColumn({ name: '_id' })
  _id: ObjectId;

  @Column()
  userId: string;

  @Column()
  grossAmount: number;

  @Column()
  aCommissions: number;

  @Column()
  employerSocialSercurity: number;

  @Column()
  incomeTax: number;

  @Column()
  socialSercurityWorks: number;

  @Column()
  healthTax: number;

  @Column()
  compensation: number;

  @Column()
  reward: number;

  @Column()
  required: number;

  @Column()
  advancesDebtRepayment: number;

  @Column()
  netAmount: number;
}
