import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { UsersService } from 'src/module/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/users/entities/users.entity';
import { Payment } from 'src/module/payment-settings/entities/payment.entity';
import { PaymentsService } from 'src/module/payment-settings/payments.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { BanksService } from '../banks/banks.service';
import { Bank } from '../banks/entities/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment, Bank])],
  controllers: [UploadFilesController],
  providers: [UploadFilesService, UsersService, PaymentsService, CaslAbilityFactory, BanksService],
})
export class UploadFilesModule {}
