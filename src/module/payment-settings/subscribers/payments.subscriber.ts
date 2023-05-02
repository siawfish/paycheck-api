import { Injectable } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { VerifyType } from 'src/module/users/entities/users.entity';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { FieldNameNoApproval, Payment } from '../entities/payment.entity';

@Injectable()
@EventSubscriber()
export class PaymentsSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Payment;
  }

  async beforeInsert(event: InsertEvent<Payment>) {
    const ds: Payment = null;
    console.log('🚀 ~ file: payments.subscriber.ts ~ line 16 ~ PaymentsSubscriber ~ ds', ds);

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
}
