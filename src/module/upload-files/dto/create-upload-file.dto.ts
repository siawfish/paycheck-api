import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { KeyType } from '../entities/upload-file.entity';

export class CreateUploadFileDto {
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(KeyType)
  key: KeyType;
}
