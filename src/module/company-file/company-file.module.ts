import { Module } from '@nestjs/common';
import { CompanyFileService } from './company-file.service';
import { CompanyFileController } from './company-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyFile } from './entities/company-file.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyFile])],
  controllers: [CompanyFileController],
  providers: [CompanyFileService, CaslAbilityFactory],
})
export class CompanyFileModule {}
