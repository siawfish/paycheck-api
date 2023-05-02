import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceEntity } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, InvoiceEntity])],
  controllers: [InvoicesController],
  providers: [InvoicesService, CaslAbilityFactory, UsersService],
})
export class InvoicesModule {}
