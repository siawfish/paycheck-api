import { PartialType } from '@nestjs/swagger';
import { CreateEmploymentDto } from './create-employment.dto';

export class UpdateEmploymentDto extends PartialType(CreateEmploymentDto) {}
