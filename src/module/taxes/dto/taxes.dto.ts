import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IDConstraint } from 'src/validation/basic.validation';

export class TaxesDTO {
  @ApiProperty({
    description: 'userId',
    example: '620e0ae39f318b1d4f5246db',
  })
  @Validate(IDConstraint)
  userId: string;

  @ApiProperty({
    description: 'grossAmount',
    example: 9000,
  })
  grossAmount: number;

  @ApiProperty({
    description: 'aCommissions',
    example: 90,
  })
  aCommissions: number;

  @ApiProperty({
    description: 'employerSocialSercurity',
    example: 147,
  })
  employerSocialSercurity: number;

  @ApiProperty({
    description: 'incomeTax',
    example: 1247,
  })
  incomeTax: number;

  @ApiProperty({
    description: 'socialSercurityWorks',
    example: 111,
  })
  socialSercurityWorks: number;

  @ApiProperty({
    description: 'healthTax',
    example: 25,
  })
  healthTax: number;

  @ApiProperty({
    description: 'compensation',
    example: 0,
  })
  compensation: number;

  @ApiProperty({
    description: 'reward',
    example: 0,
  })
  reward: number;

  @ApiProperty({
    description: 'required',
    example: 99,
  })
  required: number;

  @ApiProperty({
    description: 'advancesDebtRepayment',
    example: 254,
  })
  advancesDebtRepayment: number;

  @ApiProperty({
    description: 'netAmount',
    example: 7254,
  })
  netAmount: number;
}
