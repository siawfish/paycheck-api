import { Module } from '@nestjs/common';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CaslAbilityFactory],
  controllers: [UsersController],
})
export class UsersModule {}
