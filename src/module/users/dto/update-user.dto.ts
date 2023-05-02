import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { LanguageType } from 'src/module/users/entities/users.entity';
import { EmailConstraint, FullNameConstraint, IdentityIDConstraint, PasswordConstraint } from 'src/validation/register.validation';
import { CountryCode } from 'libphonenumber-js';

export enum FieldNoApproval {
  password = 'password',
  language = 'language',
  identityID = 'identityID',
  phone = 'phone',
  countryCode = 'countryCode',
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'example@just.engineer.com',
  })
  @Validate(EmailConstraint, { message: 'Email failed' })
  email: string;

  @ApiProperty({
    description: 'Identity Card',
    example: '053605416',
  })
  @Validate(IdentityIDConstraint, { message: 'Israeli ID  invaild ' })
  personal_id: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Donlar Tump',
  })
  @Validate(FullNameConstraint, {
    message: 'Constraint full name 2 words minimum',
  })
  full_name: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @Validate(PasswordConstraint, {
    message: 'Constraint password 6 words minimum',
  })
  password: string;

  @ApiProperty({
    description: 'Country Code',
    example: '+84',
  })
  country_code: CountryCode;

  @ApiProperty({
    description: 'Phone number',
    example: '964816123',
  })
  phone_number: string;

  @ApiProperty({
    description: 'Language',
    example: '',
  })
  language: LanguageType;

  @ApiProperty({
    description: 'Companies',
    example: ['625d2245f9c10da8a564906d', '625d2333eb64abb4ae08f66d', '625d233deb64abb4ae08f66e'],
  })
  companies: Array<string>;

  @ApiProperty({
    example: '',
  })
  workFor: string;
}
