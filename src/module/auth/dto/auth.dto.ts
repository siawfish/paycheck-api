import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserType } from 'src/module/users/entities/users.entity';
import { AddressConstraint, EmailConstraint, FullNameConstraint, IdentityIDConstraint, PasswordConstraint } from 'src/validation/register.validation';
import { CountryCode } from 'libphonenumber-js';
import { IDConstraint } from 'src/validation/basic.validation';

export class LoginDto {
  @ApiProperty({
    description: 'Personal ID',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @Validate(IdentityIDConstraint)
  personal_id: string;

  @ApiProperty({
    description: 'Password',
    example: '',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(PasswordConstraint, {
    message: 'Constraint password 6 words minimum',
  })
  password: string;
}
export class RegisterForUserDto {
  @ApiProperty({
    description: 'Identity Card',
    example: '053605416',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(IdentityIDConstraint, { message: 'Israeli ID  invaild ' })
  personal_id: string;

  @ApiProperty({
    description: 'Email',
    example: 'example@just.engineer.com',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Validate(EmailConstraint, { message: 'Email failed' })
  email: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Donlar Tump',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(FullNameConstraint, {
    message: 'Constraint full name 2 words minimum',
  })
  full_name: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(PasswordConstraint, {
    message: 'Constraint password 6 words minimum',
  })
  password: string;

  @ApiProperty({
    description: 'Country Code',
    example: '+84',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  country_code: CountryCode;

  @ApiProperty({
    description: 'Phone number',
    example: '964816205',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: '',
  })
  @Transform(({ value }) => value.trim())
  @Validate(IDConstraint)
  employment_id: string;

  @ApiProperty({
    description: 'Address',
    example: '',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Validate(AddressConstraint, {
    message: 'Constraint address 2 words and 6 characters',
  })
  address: string;

  @ApiProperty({
    description: 'Country',
    example: 'Viet Nam',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Company',
    example: '625d2245f9c10da8a564906d',
  })
  @IsDefined()
  @IsString()
  @Validate(IDConstraint)
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({
    description: 'role',
    example: UserType.FREELANCER,
  })
  @IsDefined()
  @IsString()
  @IsEnum(UserType)
  @IsNotEmpty()
  freelancer_type: string;
}

export class ForgotPassword {
  @ApiProperty({
    description: 'OTP includes 4 digitals',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  OTP: string;

  @ApiProperty({
    description: 'must be a single String of 12 bytes or a string of 24 hex characters',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Validate(IdentityIDConstraint)
  personal_id: string;

  @ApiProperty({
    description: 'Constraint password 6 words minimum',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Validate(PasswordConstraint, { message: 'Constraint password 6 words minimum' })
  new_password: string;
}

export class GetOtpDto {
  @ApiProperty({
    description: 'Personal ID',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @Validate(IdentityIDConstraint)
  personal_id: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'OTP',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  OTP: string;

  @ApiProperty({
    description: 'smsId',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @Validate(IDConstraint)
  userId: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'new_password',
    example: '',
  })
  @IsDefined()
  @IsNotEmpty()
  @Validate(PasswordConstraint, {
    message: 'Constraint password 6 words minimum',
  })
  new_password: string;

  @ApiProperty({
    description: 'old_password',
    example: '',
  })
  old_password: string;
}
