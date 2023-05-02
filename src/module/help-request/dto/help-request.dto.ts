import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsPhoneNumber, Validate } from 'class-validator';
import { PhoneNumberIsarelConstraint } from 'src/validation/basic.validation';

export class HelpRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Validate(PhoneNumberIsarelConstraint)
  @ApiProperty({
    description: 'phonenumber',
    example: '0393509856',
  })
  phonenumber: string;
  @MinLength(5)
  @ApiProperty({
    description: 'content',
    example: 'i can not find my persional id',
  })
  content: string;
}
