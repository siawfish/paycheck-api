import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],

  controllers: [BanksController],
  providers: [BanksService, CaslAbilityFactory],
})
export class BanksModule {}
