import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IDConstraint } from 'src/validation/basic.validation';

export class CreateFcmDto {
  @ApiProperty({
    description: 'User id',
    example: '625d2245f9c10da8a564906d',
  })
  @IsDefined()
  @IsString()
  @Validate(IDConstraint)
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  fcm_token: string;
}
