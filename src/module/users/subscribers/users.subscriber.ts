import { Injectable } from '@nestjs/common';
import { isEnum, isString } from 'class-validator';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Repository, LoadEvent, UpdateEvent } from 'typeorm';
import {
  FieldNameApprovalDeliveryProfile,
  FieldNameApprovalFreelancerProfile,
  FieldNameNoApproval,
  Role,
  User,
  UserType,
  VerifyType,
} from '../entities/users.entity';
import { ObjectId } from 'mongodb';
import { Payment } from 'src/module/payment-settings/entities/payment.entity';
import { Company } from 'src/module/companies/entities/company.entity';
import { Employment } from 'src/module/employments/entities/employment.entity';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return User;
  }

  // Add verification attributes before insert
  async beforeInsert(event: InsertEvent<User>) {
    //Required user
    event.entity['role'] = Role.USER;

    Object.keys(event.entity).reduce((total, currentValue) => {
      if (event.entity[currentValue] && !isEnum(currentValue, FieldNameNoApproval)) {
        event.entity[currentValue + '_approval'] = VerifyType.PENDING;

        return currentValue;
      } else if (!event.entity[currentValue]) {
        delete event.entity[currentValue];
      }
      return currentValue;
    }, 'start');
  }

  //Create Payment after insert User
  async afterInsert(event: InsertEvent<User>) {
    const paymentRepository: Repository<Payment> = event.connection.manager.getRepository<Payment>('payment_settings');
    await paymentRepository.save({ user_id: event.entity._id, personal_id: event.entity.personal_id });
  }

  async afterLoad(entity: any, event?: LoadEvent<User>) {
    entity.isApproved = true;
    // Get Payment and merge to response
    const paymentRepository: Repository<Payment> = event.connection.manager.getRepository<Payment>('payment_settings');
    const payment = await paymentRepository.findOne({ where: { user_id: ObjectId(entity._id) } });
    if (payment) {
      payment._id = payment._id.toString();
      payment.user_id = payment.user_id.toString();
      entity.payment = payment;
    }
    // Get Companies and merge to response
    if (entity?.companies) {
      if (isString(entity.companies[0])) {
        const companies_id = [];
        entity.companies.forEach((value) => {
          companies_id.push(ObjectId(value));
        });
        const companyRepository: Repository<Company> = event.connection.manager.getRepository<Company>('companies');
        const companies = await companyRepository.find({ where: { _id: { $in: companies_id } } });
        companies.forEach((value, i) => {
          companies[i]._id = companies[i]._id.toString();
        });
        entity.companies = companies;
      }
    }

    if (entity.freelancer_type == UserType.FREELANCER) {
      Object.keys(entity).forEach((value) => {
        const ls = value.length;

        if (isEnum(value.slice(0, ls - 9), FieldNameApprovalFreelancerProfile) && entity[value] != VerifyType.APPROVED) {
          entity.isApproved = false;
        }
      });
    } else {
      Object.keys(entity).forEach((value) => {
        const ls = value.length;
        if (isEnum(value.slice(0, ls - 9), FieldNameApprovalDeliveryProfile) && entity[value] != VerifyType.APPROVED) {
          entity.isApproved = false;
        }
      });
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    const entity = event.entity;
    if (entity?.employment_id) {
      const employmentRepository: Repository<Employment> = event.connection.manager.getRepository<Employment>('employments');
      const employment = await employmentRepository.findOne({ where: { _id: ObjectId(entity.employment_id) } });
      entity['employment_name'] = employment.name;
      entity['employment_id_approval'] = VerifyType.PENDING;
    }
    //Change Companies to Array<string>
    if (entity?.companies) {
      if (!isString(entity.companies[0])) {
        const companies_id = [...new Set(entity.companies.map((company) => company._id.toString()))];
        entity.companies = companies_id;
      }
    }
  }
}
