import { ApiProperty } from '@nestjs/swagger';

export class TermOfServiceDTO {
  @ApiProperty({
    description: 'content',
    example: 'Content in here',
  })
  content: string;
}
