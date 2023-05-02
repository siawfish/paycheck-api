import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IDSConstraint } from 'src/validation/basic.validation';

export class NotificationUser {
  @ApiProperty({
    description: 'User ids',
    example: ['625d2245f9c10da8a564906d', '823d2245f9c10da8a564906d'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDefined()
  @IsNotEmpty()
  @Validate(IDSConstraint)
  user_ids: Array<string>;

  @ApiProperty({
    description: 'Content',
    example: '',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Title',
    example: 'Notification',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title: string;
}

export class NotificationGlobal {
  @ApiProperty({
    description: 'Content',
    example: '',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Title',
    example: 'Notification',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title: string;
}
