import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IDConstraint } from 'src/validation/basic.validation';

export class CreateCompanyFileDto {
  @ApiProperty({
    description: 'Company id',
    example: '625d2245f9c10da8a564906d',
  })
  @IsDefined()
  @IsString()
  @Validate(IDConstraint)
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({
    example: ['https://vcdn1-dulich.vnecdn.net/2021/05/18/VnExpress-MauSon-10-1621330131.jpg'],
  })
  @IsDefined()
  @IsNotEmpty()
  file_url: Array<string>;

  @ApiProperty({
    example: 'VnExpress-MauSon-10-1621330131.jpg',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  file_name: string;
}
