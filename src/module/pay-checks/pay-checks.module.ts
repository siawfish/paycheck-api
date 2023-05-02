import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { PayChecksEntity } from './entity/pay-checks.entity';
import { PayChecksController } from './pay-checks.controller';
import { PayChecksService } from './pay-checks.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PayChecksEntity])],
  controllers: [PayChecksController],
  providers: [PayChecksService, CaslAbilityFactory, UsersService],
})
export class PayChecksModule {}
