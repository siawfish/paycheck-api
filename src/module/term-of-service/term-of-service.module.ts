import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermOfServiceEntity } from './entity/term-of-service.entity';
import { TermOfServiceController } from './term-of-service.controller';
import { TermOfServiceService } from './term-of-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([TermOfServiceEntity])],
  controllers: [TermOfServiceController],
  providers: [TermOfServiceService],
})
export class TermOfServiceModule {}
