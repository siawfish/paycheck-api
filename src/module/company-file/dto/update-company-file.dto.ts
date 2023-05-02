import { PartialType } from '@nestjs/swagger';
import { CreateCompanyFileDto } from './create-company-file.dto';

export class UpdateCompanyFileDto extends PartialType(CreateCompanyFileDto) {}
