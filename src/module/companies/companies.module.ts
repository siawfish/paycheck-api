import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService, CaslAbilityFactory],
})
export class CompaniesModule {}
