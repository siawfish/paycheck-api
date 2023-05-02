import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { BankTransferController } from './bank-transfer.controller';
import { BankTransferService } from './bank-transfer.service';
import { BankTransferEntity } from './entity/bank-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BankTransferEntity])],
  controllers: [BankTransferController],
  providers: [BankTransferService, CaslAbilityFactory, UsersService],
})
export class BankTransferModule {}
