import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IDConstraint } from 'src/validation/basic.validation';

export class BankTransferDTO {
  @ApiProperty({
    description: 'userId',
    example: '620e0ae39f318b1d4f5246db',
  })
  @Validate(IDConstraint)
  userId: string;

  @ApiProperty({
    description: 'accountNumber',
    example: '02868667302',
  })
  accountNumber: string;
  @ApiProperty({
    description: 'branchNumber',
    example: 'branchNumber',
  })
  branchNumber: string;
  @ApiProperty({
    description: 'bankName',
    example: 'TP Bank',
  })
  bankName: string;
  @ApiProperty({
    description: 'amount',
    example: '300',
  })
  amount: number;
  @ApiProperty({
    description: 'invoiceFileUrl',
    example: 'image/invoices/abc.xyz',
  })
  invoiceFileUrl: Array<string>;
  @ApiProperty({
    description: 'transferDate',
    example: 'DD/mm/YYYY HH:mm:ss',
  })
  transferDate: Date;
}
