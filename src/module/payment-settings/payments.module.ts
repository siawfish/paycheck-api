import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { Bank } from '../banks/entities/bank.entity';
import { BanksService } from '../banks/banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Bank])],
  controllers: [PaymentsController],
  providers: [PaymentsService, CaslAbilityFactory, UsersService, BanksService],
})
export class PaymentsModule {}
