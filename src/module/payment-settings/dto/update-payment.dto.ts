import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { BankIDConstraint } from 'src/validation/payment.validation';
import { BankDetails } from '../entities/payment.entity';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'BankDetails',
    example: {
      account_number: '',
      branch_number: '',
      account_owner: '',
      bank_id: '',
    },
  })
  @Validate(BankIDConstraint)
  bank_detail: BankDetails;

  @ApiProperty({
    description: 'InvoiceName',
    example: 'asdasdas',
  })
  invoice_name: string;
}
