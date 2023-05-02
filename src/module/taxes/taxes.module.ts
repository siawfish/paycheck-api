import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxesEntity } from './entity/taxes.entity';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaxesEntity])],
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}
