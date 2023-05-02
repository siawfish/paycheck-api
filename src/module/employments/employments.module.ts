import { Module } from '@nestjs/common';
import { EmploymentsService } from './employments.service';
import { EmploymentsController } from './employments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employment } from './entities/employment.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Employment])],
  controllers: [EmploymentsController],
  providers: [EmploymentsService, CaslAbilityFactory],
})
export class EmploymentsModule {}
